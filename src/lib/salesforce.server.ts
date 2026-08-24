import process from "node:process";

/**
 * Salesforce client for the public jobs board.
 *
 * Server-only — the .server.ts suffix keeps this out of the client bundle so
 * the private key and access tokens never reach the browser.
 *
 * Auth is the JWT Bearer flow: we sign a short-lived assertion with the
 * Connected App's private key and exchange it for an access token. There is no
 * user password involved, which is why Salesforce still supports it after
 * deprecating the username-password flow.
 *
 * Env is read inside functions, never at module scope: on Workers-style
 * runtimes the environment binds per request, so a module-level read is
 * undefined.
 */

const API_VERSION = "v62.0";

/** Token is cached in-module; serverless instances reuse it while warm. */
const TOKEN_SKEW_MS = 60_000;
let tokenCache: { token: string; instanceUrl: string; expiresAt: number } | null = null;

/** Jobs are cached briefly so a traffic spike can't hammer the Salesforce API. */
const JOBS_TTL_MS = 5 * 60_000;
let jobsCache: { at: number; result: JobsResult } | null = null;

/** Field API names we display, confirmed against the org's schema. */
const PREFERRED_FIELDS = [
  "nuProducts__External_Job_Title__c",
  "nuProducts__Job_Title__c",
  "nuProducts__Location_State_Province__c",
  "nuProducts__Location_City__c",
  "nuProducts__Specialty__c",
  "nuProducts__Specialties__c",
  "nuProducts__Provider_Type__c",
  "nuProducts__Provider_Credential__c",
  "nuProducts__Job_Class__c",
  "Priority__c",
  "nuProducts__External_Job_Description__c",
  "nuProducts__Estimated_Start_Date__c",
  "nuProducts__Requested_Dates_of_Coverage_and_Schedule__c",
  "nuProducts__Status__c",
  "nuProducts__Open_Date__c",
] as const;

/**
 * Only genuinely open, externally-postable roles reach the public page.
 *
 * Of 2,840 job records, 1,652 are Closed and 326 already Placed — showing
 * those would have candidates applying to filled work. Post_Externally__c is
 * the business's own "this may be posted publicly" flag, so it is honoured
 * rather than second-guessed. Published__c is never set in this org, so it is
 * deliberately not used as a gate.
 */
/**
 * Statuses a candidate can usefully act on. Placed, Hold and Closed are
 * excluded — those would have people applying to work that is gone.
 *
 * The Closed_Date guard that used to sit here did nothing: no record in the org
 * carries a value in that field, so `= null` matched closed jobs too. Status is
 * what actually excludes them.
 */
const PUBLIC_JOB_STATUSES = ["Open", "Assigned", "Marketed", "Recruiting"];

const PUBLIC_JOB_FILTER =
  `nuProducts__Status__c IN (${PUBLIC_JOB_STATUSES.map((s) => `'${s}'`).join(", ")}) ` +
  "AND nuProducts__Post_Externally__c = true";

export type Job = {
  id: string;
  title: string;
  state: string | null;
  city: string | null;
  specialty: string | null;
  providerType: string | null;
  jobClass: string | null;
  /** Critical | High | Normal | Low */
  priority: string | null;
  description: string | null;
  startDate: string | null;
  duration: string | null;
  postedAt: string | null;
};

export type JobsResult =
  | { status: "ok"; jobs: Job[]; fetchedAt: string }
  /** Credentials absent — the page renders its "not connected yet" state. */
  | { status: "unconfigured"; missing: string[] }
  /** Salesforce reachable but unhappy. `detail` is for operators, not visitors. */
  | { status: "error"; detail: string };

type SalesforceConfig = {
  loginUrl: string;
  clientId: string;
  username: string;
  privateKeyPem: string;
  jobObject: string;
};

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() !== "" ? value.trim() : undefined;
}

/**
 * The key may arrive as raw PEM (Vercel env var, newlines escaped) or as a path
 * to a .key file (local dev). Env var wins — a file path is meaningless once
 * the app is deployed to a serverless runtime.
 */
async function readPrivateKey(): Promise<string | undefined> {
  const inline = readEnv("SALESFORCE_JWT_PRIVATE_KEY");
  if (inline) return inline.replace(/\\n/g, "\n");

  const path = readEnv("SALESFORCE_JWT_PRIVATE_KEY_PATH");
  if (!path) return undefined;
  try {
    const { readFile } = await import("node:fs/promises");
    return await readFile(path, "utf8");
  } catch {
    return undefined;
  }
}

async function getConfig(): Promise<SalesforceConfig | { missing: string[] }> {
  const clientId = readEnv("SALESFORCE_CLIENT_ID");
  const username = readEnv("SALESFORCE_USERNAME");
  const privateKeyPem = await readPrivateKey();

  const missing: string[] = [];
  if (!clientId) missing.push("SALESFORCE_CLIENT_ID");
  if (!username) missing.push("SALESFORCE_USERNAME");
  if (!privateKeyPem) missing.push("SALESFORCE_JWT_PRIVATE_KEY");
  if (missing.length) return { missing };

  return {
    loginUrl: (readEnv("SALESFORCE_LOGIN_URL") ?? "https://login.salesforce.com").replace(
      /\/+$/,
      "",
    ),
    clientId: clientId!,
    username: username!,
    privateKeyPem: privateKeyPem!,
    jobObject: readEnv("SALESFORCE_JOB_OBJECT") ?? "nuProducts__Job__c",
  };
}

function base64Url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const byte of view) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** DER length octets: short form under 128, long form above. */
function derLength(n: number): number[] {
  if (n < 0x80) return [n];
  const bytes: number[] = [];
  for (let v = n; v > 0; v >>>= 8) bytes.unshift(v & 0xff);
  return [0x80 | bytes.length, ...bytes];
}

/**
 * Wrap a bare PKCS#1 RSAPrivateKey in a PKCS#8 PrivateKeyInfo.
 *
 * `openssl genrsa` and older `openssl req` builds emit PKCS#1 ("BEGIN RSA
 * PRIVATE KEY"), but WebCrypto only imports PKCS#8. The wrapper is a fixed
 * prefix, so we can convert rather than make the operator re-run openssl.
 */
function pkcs1ToPkcs8(pkcs1: Uint8Array): Uint8Array<ArrayBuffer> {
  const version = [0x02, 0x01, 0x00];
  // AlgorithmIdentifier: OID 1.2.840.113549.1.1.1 (rsaEncryption) + NULL params
  const algorithm = [
    0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00,
  ];
  const keyOctetHeader = [0x04, ...derLength(pkcs1.length)];
  const contentLength = version.length + algorithm.length + keyOctetHeader.length + pkcs1.length;
  const header = [0x30, ...derLength(contentLength), ...version, ...algorithm, ...keyOctetHeader];

  const out = new Uint8Array(new ArrayBuffer(header.length + pkcs1.length));
  out.set(header, 0);
  out.set(pkcs1, header.length);
  return out;
}

/** PEM → CryptoKey, accepting either PKCS#8 or PKCS#1. Salesforce needs RS256. */
async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const isPkcs1 = /-----BEGIN RSA PRIVATE KEY-----/.test(pem);
  const body = pem
    .replace(/-----BEGIN [^-]+-----/, "")
    .replace(/-----END [^-]+-----/, "")
    .replace(/\s+/g, "");
  let der = Uint8Array.from(atob(body), (c) => c.charCodeAt(0));
  if (isPkcs1) der = pkcs1ToPkcs8(der);

  return crypto.subtle.importKey(
    "pkcs8",
    der,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function signAssertion(config: SalesforceConfig): Promise<string> {
  const header = base64Url(new TextEncoder().encode(JSON.stringify({ alg: "RS256" })));
  const claims = base64Url(
    new TextEncoder().encode(
      JSON.stringify({
        iss: config.clientId,
        sub: config.username,
        aud: config.loginUrl,
        exp: Math.floor(Date.now() / 1000) + 180,
      }),
    ),
  );
  const signingInput = `${header}.${claims}`;
  const key = await importPrivateKey(config.privateKeyPem);
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signingInput),
  );
  return `${signingInput}.${base64Url(signature)}`;
}

async function getAccessToken(config: SalesforceConfig) {
  if (tokenCache && tokenCache.expiresAt > Date.now() + TOKEN_SKEW_MS) return tokenCache;

  const assertion = await signAssertion(config);
  const response = await fetch(`${config.loginUrl}/services/oauth2/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    const err = [body.error, body.error_description].filter(Boolean).join(": ");
    throw new Error(`Salesforce token request failed (${response.status}): ${err || "no detail"}`);
  }

  tokenCache = {
    token: String(body.access_token),
    instanceUrl: String(body.instance_url).replace(/\/+$/, ""),
    // Salesforce doesn't return expires_in for this flow; sessions are long,
    // so refresh hourly and let a 401 force an earlier retry.
    expiresAt: Date.now() + 60 * 60_000,
  };
  return tokenCache;
}

async function salesforceGet(path: string, retryOn401 = true): Promise<unknown> {
  const config = await getConfig();
  if ("missing" in config) throw new Error("Salesforce is not configured");

  const auth = await getAccessToken(config);
  const response = await fetch(`${auth.instanceUrl}${path}`, {
    headers: { authorization: `Bearer ${auth.token}` },
  });

  if (response.status === 401 && retryOn401) {
    tokenCache = null;
    return salesforceGet(path, false);
  }
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Salesforce ${response.status} on ${path}: ${text.slice(0, 300)}`);
  }
  return response.json();
}

/**
 * Ask the org which fields the job object actually has, then query only those.
 * The object's field names vary between nuProducts packages/orgs, and a single
 * unknown field makes the whole SOQL query fail — so discover instead of guess.
 */
async function resolveQueryFields(
  jobObject: string,
  preferred: readonly string[],
): Promise<string[]> {
  const describe = (await salesforceGet(
    `/services/data/${API_VERSION}/sobjects/${jobObject}/describe`,
  )) as { fields?: Array<{ name: string }> };

  const available = new Set((describe.fields ?? []).map((f) => f.name));
  const fields = ["Id", "Name", "CreatedDate", "LastModifiedDate"].filter((f) => available.has(f));
  for (const field of preferred) if (available.has(field)) fields.push(field);
  return fields;
}

/** External descriptions are rich text; cards need plain prose. */
function stripHtml(value: string): string {
  return value
    .replace(/<(br|\/p|\/div|\/h[1-6]|\/li)[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&(#39|rsquo|lsquo);/gi, "'")
    .replace(/&(quot|ldquo|rdquo);/gi, '"')
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pick(record: Record<string, unknown>, ...names: string[]): string | null {
  for (const name of names) {
    const value = record[name];
    if (value != null && String(value).trim() !== "") return String(value).trim();
  }
  return null;
}

/**
 * The card shows three clamped lines and the search box matches on it, so the
 * list only needs the opening of a description — not all ~1,400 characters.
 *
 * Shipping the full text for every role put 497 KB of hydration payload into
 * /jobs, four fifths of that page, and the same weight onto every landing
 * page. The detail route queries separately and keeps the whole thing.
 */
const LIST_DESCRIPTION_CHARS = 220;

function summarise(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= LIST_DESCRIPTION_CHARS) return clean;
  const cut = clean.slice(0, LIST_DESCRIPTION_CHARS);
  // Break on a word so the clamp does not end mid-word before the ellipsis.
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 120 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

function toJob(record: Record<string, unknown>): Job {
  const description = pick(record, "nuProducts__External_Job_Description__c");
  return {
    id: String(record.Id ?? ""),
    title:
      pick(record, "nuProducts__External_Job_Title__c", "nuProducts__Job_Title__c", "Name") ??
      "Untitled position",
    state: pick(record, "nuProducts__Location_State_Province__c"),
    city: pick(record, "nuProducts__Location_City__c"),
    // Specialty__c is the single picklist; Specialties__c is multi-select and
    // comes back semicolon-joined, which makes a poor filter value.
    specialty: pick(record, "nuProducts__Specialty__c", "nuProducts__Specialties__c"),
    providerType: pick(record, "nuProducts__Provider_Type__c"),
    jobClass: pick(record, "nuProducts__Job_Class__c"),
    priority: pick(record, "Priority__c"),
    description: description ? summarise(stripHtml(description)) || null : null,
    startDate: pick(record, "nuProducts__Estimated_Start_Date__c"),
    // Free text in the org — often a multi-line schedule. Collapse it here;
    // the card decides whether it is short enough to show.
    duration:
      pick(record, "nuProducts__Requested_Dates_of_Coverage_and_Schedule__c")?.replace(
        /\s+/g,
        " ",
      ) ?? null,
    postedAt: pick(record, "nuProducts__Open_Date__c", "CreatedDate"),
  };
}

export async function fetchJobs(): Promise<JobsResult> {
  if (jobsCache && Date.now() - jobsCache.at < JOBS_TTL_MS) return jobsCache.result;

  const config = await getConfig();
  if ("missing" in config) return { status: "unconfigured", missing: config.missing };

  let result: JobsResult;
  try {
    const fields = await resolveQueryFields(config.jobObject, PREFERRED_FIELDS);
    const soql =
      `SELECT ${fields.join(", ")} FROM ${config.jobObject} ` +
      `WHERE ${PUBLIC_JOB_FILTER} ` +
      `ORDER BY nuProducts__Open_Date__c DESC NULLS LAST LIMIT 500`;
    const data = (await salesforceGet(
      `/services/data/${API_VERSION}/query?q=${encodeURIComponent(soql)}`,
    )) as { records?: Array<Record<string, unknown>> };

    result = {
      status: "ok",
      jobs: (data.records ?? []).map(toJob).filter((j) => j.id),
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("[salesforce] job fetch failed", error);
    result = { status: "error", detail: error instanceof Error ? error.message : String(error) };
  }

  jobsCache = { at: Date.now(), result };
  return result;
}

/* ------------------------------------------------------------------ *
 * Single job detail
 * ------------------------------------------------------------------ */

/**
 * Fields shown on a job's own page.
 *
 * Deliberately excluded: every rate field (pay, bill, malpractice, margin) and
 * the client/work-location lookups. Bill rates and margins are commercial data,
 * and naming the facility before a provider has agreed to be presented would
 * undercut the promise made on the provider-inquiry page.
 */
const DETAIL_FIELDS = [
  "nuProducts__External_Job_Title__c",
  "nuProducts__Job_Title__c",
  "nuProducts__External_Job_Description__c",
  "nuProducts__Job_Class__c",
  "nuProducts__Number_of_Positions__c",
  "nuProducts__Location_City__c",
  "nuProducts__Location_State_Province__c",
  "nuProducts__Specialty__c",
  "nuProducts__Specialties__c",
  "nuProducts__Subspecialties__c",
  "nuProducts__Provider_Type__c",
  "nuProducts__Provider_Credential__c",
  "nuProducts__Board_Status__c",
  "nuProducts__Estimated_Start_Date__c",
  "nuProducts__Estimated_End_Date__c",
  "nuProducts__Open_Date__c",
  "nuProducts__Requested_Dates_of_Coverage_and_Schedule__c",
  "nuProducts__Schedule_Details__c",
  "nuProducts__Shift_Schedule__c",
  "Call_Details__c",
  "nuProducts__Solo_Coverage__c",
  "nuProducts__APP_Backup__c",
  "nuProducts__Procedures_Required__c",
  "nuProducts__Requires_active_state_license__c",
  "nuProducts__Accepts_Compact_License__c",
  "nuProducts__Willing_to_License__c",
  "nuProducts__Estimated_Privileging_Timeline__c",
  "Compliance_Requirements__c",
  "Minimum_Years_Experience__c",
  "Day_to_Day_Details__c",
  "nuProducts__Case_Mix__c",
  "Other_Job_Specific_Details__c",
] as const;

export type JobDetail = Job & {
  reference: string | null;
  /** Sanitised HTML, safe to inject. */
  descriptionHtml: string | null;
  positions: string | null;
  subspecialties: string[];
  credential: string | null;
  boardStatus: string | null;
  endDate: string | null;
  scheduleDetails: string | null;
  shiftSchedule: string | null;
  callDetails: string | null;
  coverageDates: string | null;
  dayToDay: string | null;
  caseMix: string[];
  otherDetails: string | null;
  privilegingTimeline: string | null;
  compliance: string[];
  minimumYearsExperience: string | null;
  soloCoverage: boolean | null;
  appBackup: boolean | null;
  proceduresRequired: boolean | null;
  requiresActiveLicense: boolean | null;
  acceptsCompactLicense: boolean | null;
  willingToLicense: boolean | null;
};

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "blockquote",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "table",
  "thead",
  "tbody",
  "tr",
  "td",
  "th",
  "span",
  "div",
]);

/**
 * Allowlist sanitiser for the rich-text description.
 *
 * The copy is written by staff in Salesforce, but it still crosses a trust
 * boundary on its way into the page, so nothing is injected that wasn't
 * explicitly permitted. Every attribute is dropped — including the inline
 * styles Salesforce's editor emits — which also stops the description fighting
 * the site's typography.
 */
function sanitizeHtml(value: string): string {
  return (
    value
      // Elements whose *content* must go too, not just their tags.
      .replace(/<(script|style|iframe|object|embed|form|input|svg)\b[\s\S]*?<\/\1\s*>/gi, "")
      .replace(/<\/?(script|style|iframe|object|embed|form|input|svg)\b[^>]*>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<\/?([a-z0-9]+)\b[^>]*>/gi, (match, rawTag: string) => {
        const tag = rawTag.toLowerCase();
        if (!ALLOWED_TAGS.has(tag)) return "";
        return match.startsWith("</") ? `</${tag}>` : `<${tag}>`;
      })
      .replace(/(<p>\s*<\/p>|<div>\s*<\/div>|<span>\s*<\/span>)/gi, "")
      .trim()
  );
}

function flag(record: Record<string, unknown>, name: string): boolean | null {
  const value = record[name];
  return typeof value === "boolean" ? value : null;
}

/** Multi-picklists arrive semicolon-joined; Case Mix is tab/newline separated. */
function splitList(value: string | null, separator = /[;\n]+/): string[] {
  if (!value) return [];
  return value
    .split(separator)
    .map((v) => v.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

const detailCache = new Map<string, { at: number; job: JobDetail | null }>();

export async function fetchJobById(id: string): Promise<JobDetail | null | { error: string }> {
  // Salesforce ids are alphanumeric; refuse anything else rather than
  // interpolating it into SOQL.
  if (!/^[a-zA-Z0-9]{15,18}$/.test(id)) return null;

  const cached = detailCache.get(id);
  if (cached && Date.now() - cached.at < JOBS_TTL_MS) return cached.job;

  const config = await getConfig();
  if ("missing" in config) return { error: "unconfigured" };

  try {
    const fields = await resolveQueryFields(config.jobObject, DETAIL_FIELDS);
    // The public filter is repeated here on purpose: without it, anyone with a
    // record id could read Closed, Hold, or internal-only jobs.
    const soql =
      `SELECT ${fields.join(", ")} FROM ${config.jobObject} ` +
      `WHERE Id = '${id}' AND ${PUBLIC_JOB_FILTER} LIMIT 1`;
    const data = (await salesforceGet(
      `/services/data/${API_VERSION}/query?q=${encodeURIComponent(soql)}`,
    )) as { records?: Array<Record<string, unknown>> };

    const record = data.records?.[0];
    const job = record ? toJobDetail(record) : null;
    detailCache.set(id, { at: Date.now(), job });
    return job;
  } catch (error) {
    console.error("[salesforce] job detail fetch failed", error);
    return { error: error instanceof Error ? error.message : String(error) };
  }
}

function toJobDetail(record: Record<string, unknown>): JobDetail {
  const html = pick(record, "nuProducts__External_Job_Description__c");
  return {
    ...toJob(record),
    // toJob trims this to a card-sized summary for the list. The detail page
    // and its JobPosting markup need the whole posting — Google reads that
    // description, and a truncated one is a weaker listing.
    description: html ? stripHtml(html) || null : null,
    reference: pick(record, "Name"),
    descriptionHtml: html ? sanitizeHtml(html) || null : null,
    positions: pick(record, "nuProducts__Number_of_Positions__c"),
    subspecialties: splitList(pick(record, "nuProducts__Subspecialties__c")),
    credential: pick(record, "nuProducts__Provider_Credential__c"),
    boardStatus: pick(record, "nuProducts__Board_Status__c"),
    endDate: pick(record, "nuProducts__Estimated_End_Date__c"),
    scheduleDetails: pick(record, "nuProducts__Schedule_Details__c"),
    shiftSchedule: pick(record, "nuProducts__Shift_Schedule__c"),
    callDetails: pick(record, "Call_Details__c"),
    coverageDates: pick(record, "nuProducts__Requested_Dates_of_Coverage_and_Schedule__c"),
    dayToDay: pick(record, "Day_to_Day_Details__c"),
    caseMix: splitList(pick(record, "nuProducts__Case_Mix__c"), /[\n\r]+/),
    otherDetails: pick(record, "Other_Job_Specific_Details__c"),
    privilegingTimeline: pick(record, "nuProducts__Estimated_Privileging_Timeline__c"),
    compliance: splitList(pick(record, "Compliance_Requirements__c")),
    minimumYearsExperience: pick(record, "Minimum_Years_Experience__c"),
    soloCoverage: flag(record, "nuProducts__Solo_Coverage__c"),
    appBackup: flag(record, "nuProducts__APP_Backup__c"),
    proceduresRequired: flag(record, "nuProducts__Procedures_Required__c"),
    requiresActiveLicense: flag(record, "nuProducts__Requires_active_state_license__c"),
    acceptsCompactLicense: flag(record, "nuProducts__Accepts_Compact_License__c"),
    willingToLicense: flag(record, "nuProducts__Willing_to_License__c"),
  };
}

/* ------------------------------------------------------------------ *
 * Applications
 * ------------------------------------------------------------------ */

const CANDIDATE_TRACKING = "nuProducts__Candidate_Tracking__c";

export type ApplicationInput = {
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateAvailable?: string;
  licenseStatus?: string;
  specialty?: string;
  smsOptIn?: boolean;
  resume?: ResumeUpload;
};

export type ApplicationResult =
  | { status: "created"; reference: string | null }
  /** Same person, same job — the record already exists, so don't make another. */
  | { status: "duplicate" }
  /** Email is already on file as a non-provider Contact — a human should look
   *  rather than us creating a second record for the same person. */
  | { status: "needs-review" }
  | { status: "job-unavailable" }
  | { status: "unconfigured" }
  | { status: "error" };

/** Single quotes and backslashes are the only SOQL string escapes that matter. */
function soqlEscape(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

async function salesforcePost(
  path: string,
  body: unknown,
  retryOn401 = true,
): Promise<Record<string, unknown>> {
  const config = await getConfig();
  if ("missing" in config) throw new Error("Salesforce is not configured");

  const auth = await getAccessToken(config);
  const response = await fetch(`${auth.instanceUrl}${path}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${auth.token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.status === 401 && retryOn401) {
    tokenCache = null;
    return salesforcePost(path, body, false);
  }

  const json = (await response.json().catch(() => ({}))) as unknown;
  if (!response.ok) {
    throw new Error(
      `Salesforce ${response.status} on ${path}: ${JSON.stringify(json).slice(0, 400)}`,
    );
  }
  return (json ?? {}) as Record<string, unknown>;
}

/** PATCH returns 204 with no body, so there is nothing to parse on success. */
async function salesforcePatch(path: string, body: unknown, retryOn401 = true): Promise<void> {
  const config = await getConfig();
  if ("missing" in config) throw new Error("Salesforce is not configured");

  const auth = await getAccessToken(config);
  const response = await fetch(`${auth.instanceUrl}${path}`, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${auth.token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.status === 401 && retryOn401) {
    tokenCache = null;
    return salesforcePatch(path, body, false);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Salesforce ${response.status} on ${path}: ${detail.slice(0, 400)}`);
  }
}

async function salesforceQuery(soql: string): Promise<Array<Record<string, unknown>>> {
  const data = (await salesforceGet(
    `/services/data/${API_VERSION}/query?q=${encodeURIComponent(soql)}`,
  )) as { records?: Array<Record<string, unknown>> };
  return data.records ?? [];
}

/** Record type ids are org-specific, so resolve them by name rather than hardcode. */
let recordTypeCache: Map<string, string> | null = null;
async function candidateTrackingRecordTypeId(name: string): Promise<string | null> {
  if (!recordTypeCache) {
    const describe = (await salesforceGet(
      `/services/data/${API_VERSION}/sobjects/${CANDIDATE_TRACKING}/describe`,
    )) as { recordTypeInfos?: Array<{ name: string; recordTypeId: string; available: boolean }> };
    recordTypeCache = new Map(
      (describe.recordTypeInfos ?? [])
        .filter((r) => r.available && r.name !== "Master")
        .map((r) => [r.name.toLowerCase(), r.recordTypeId]),
    );
  }
  return recordTypeCache.get(name.toLowerCase()) ?? null;
}

/** Contact record type ids, resolved by name so nothing org-specific is hardcoded. */
let contactRecordTypeCache: Map<string, string> | null = null;
async function contactRecordTypeId(name: string): Promise<string | null> {
  if (!contactRecordTypeCache) {
    const describe = (await salesforceGet(
      `/services/data/${API_VERSION}/sobjects/Contact/describe`,
    )) as { recordTypeInfos?: Array<{ name: string; recordTypeId: string; available: boolean }> };
    contactRecordTypeCache = new Map(
      (describe.recordTypeInfos ?? [])
        .filter((r) => r.available && r.name !== "Master")
        .map((r) => [r.name.toLowerCase(), r.recordTypeId]),
    );
  }
  return contactRecordTypeCache.get(name.toLowerCase()) ?? null;
}

type ContactMatch =
  | { kind: "provider"; id: string }
  /** Email belongs to a Contact of another type — usable neither as a
   *  candidate (the lookup filter refuses it) nor as grounds to create a
   *  near-duplicate the org's duplicate rules would reject anyway. */
  | { kind: "other-type"; id: string }
  | { kind: "none" };

/**
 * Match on email across every record type, not just Provider.
 *
 * Narrowing the search to Providers means a same-email Contact of another type
 * goes unseen, and the insert that follows trips the org's duplicate rules —
 * which is exactly what happened in testing. Matching broadly and reporting
 * what was found keeps us from ever creating a second record for one person.
 */
async function findContactByEmail(email: string): Promise<ContactMatch> {
  const providerRecordTypeId = await contactRecordTypeId("Provider");
  const rows = await salesforceQuery(
    `SELECT Id, RecordTypeId FROM Contact WHERE Email = '${soqlEscape(email)}' ` +
      `ORDER BY CreatedDate DESC LIMIT 5`,
  );
  if (rows.length === 0) return { kind: "none" };

  const provider = rows.find((r) => String(r.RecordTypeId) === providerRecordTypeId);
  if (provider) return { kind: "provider", id: String(provider.Id) };
  return { kind: "other-type", id: String(rows[0].Id) };
}

async function createProviderContact(input: ApplicationInput): Promise<string> {
  const providerRecordTypeId = await contactRecordTypeId("Provider");
  // Specialties is a multipicklist; a single selection is just the bare value.
  // Only fields every org exposes: LeadSource and the opt-out flags aren't
  // writable for this integration user, and one bad column fails the insert.
  const created = await salesforcePost(`/services/data/${API_VERSION}/sobjects/Contact`, {
    FirstName: input.firstName,
    LastName: input.lastName,
    Email: input.email,
    ...(input.phone ? { Phone: input.phone } : {}),
    ...(input.specialty ? { [CONTACT_SPECIALTY_FIELD]: input.specialty } : {}),
    ...(providerRecordTypeId ? { RecordTypeId: providerRecordTypeId } : {}),
  });
  return String(created.id);
}

export async function submitApplication(input: ApplicationInput): Promise<ApplicationResult> {
  const config = await getConfig();
  if ("missing" in config) return { status: "unconfigured" };

  try {
    // The job must still be one the public page would show — otherwise a stale
    // tab or a guessed id could file an application against a closed role.
    const job = await fetchJobById(input.jobId);
    if (job === null || (job && "error" in job)) {
      return job === null ? { status: "job-unavailable" } : { status: "error" };
    }

    const match = await findContactByEmail(input.email);

    /*
     * An email already on a non-Provider Contact used to end the whole
     * submission — nothing was written, while the form told the applicant we
     * had "flagged their interest". That is the worst possible outcome: it
     * looks like success and produces no Candidate Tracking record.
     *
     * Candidate Tracking's lookup filter only accepts Provider Contacts, so
     * the existing record cannot be used. A second Contact under the same
     * email is the right answer anyway — a hospital contact who also wants
     * assignments is genuinely two people in this CRM. If a duplicate rule
     * blocks the insert we fall back to the old behaviour rather than lose
     * the error.
     */
    let contactId: string;
    if (match.kind === "provider") {
      contactId = match.id;
    } else {
      try {
        contactId = await createProviderContact(input);
      } catch (error) {
        console.error("[salesforce] provider contact create failed", error);
        if (match.kind === "other-type") return { status: "needs-review" };
        throw error;
      }
    }

    // Consent is recorded as a separate update, never as a column on the
    // insert: one bad field fails the whole Contact create and the application
    // with it. Losing the consent flag is bad; losing the candidate is worse.
    //
    // Only ever set true. Leaving the box unchecked is not a revocation, so
    // clearing a prior opt-in on that basis would be wrong.
    if (input.smsOptIn) {
      try {
        if (await contactAcceptsField(CONTACT_SMS_CONSENT_FIELD)) {
          await salesforcePatch(`/services/data/${API_VERSION}/sobjects/Contact/${contactId}`, {
            [CONTACT_SMS_CONSENT_FIELD]: true,
          });
        }
      } catch (error) {
        console.error("[salesforce] sms consent update failed", error);
      }
    }

    const alreadyApplied = await salesforceQuery(
      `SELECT Id FROM ${CANDIDATE_TRACKING} ` +
        `WHERE nuProducts__Candidate__c = '${soqlEscape(contactId)}' ` +
        `AND nuProducts__Job__c = '${soqlEscape(input.jobId)}' LIMIT 1`,
    );
    if (alreadyApplied.length > 0) return { status: "duplicate" };

    const today = new Date().toISOString().slice(0, 10);
    // Record type follows the job's own class, matching how staff file these.
    const recordTypeId = await candidateTrackingRecordTypeId(
      job.jobClass?.toLowerCase() === "permanent" ? "Permanent" : "Locum Tenens",
    );

    const tracking = await salesforcePost(
      `/services/data/${API_VERSION}/sobjects/${CANDIDATE_TRACKING}`,
      {
        nuProducts__Candidate__c: contactId,
        nuProducts__Job__c: input.jobId,
        ...(recordTypeId ? { RecordTypeId: recordTypeId } : {}),
        // Both default to Internal Review, which is where staff triage new records.
        nuProducts__Current_Stage__c: "Internal Review",
        nuProducts__Status__c: "Internal Review",
        nuProducts__Entered_Current_Stage_On__c: today,
        Date_Submitted__c: today,
        nuProducts__Archived__c: false,
        ...(input.dateAvailable ? { nuProducts__Date_Available__c: input.dateAvailable } : {}),
        ...(input.licenseStatus ? { nuProducts__License_Status__c: input.licenseStatus } : {}),
        ...(input.specialty ? { nuProducts__Specialty__c: input.specialty } : {}),
      },
    );

    if (input.resume) {
      // Best effort: a rejected file must not sink an otherwise good application.
      try {
        await attachResume(
          input.resume,
          [String(tracking.id), contactId].filter(Boolean),
          `${input.firstName} ${input.lastName}`,
        );
      } catch (error) {
        console.error("[salesforce] resume attach failed", error);
      }
    }

    return { status: "created", reference: job.reference };
  } catch (error) {
    console.error("[salesforce] application failed", error);
    return { status: "error" };
  }
}

/* ------------------------------------------------------------------ *
 * Specialties
 * ------------------------------------------------------------------ */

const CONTACT_SPECIALTY_FIELD = "nuProducts__Specialties__c";

/**
 * Where SMS consent lands on the Contact. Overridable because orgs name this
 * differently, and guessing wrong here is expensive: Salesforce rejects the
 * whole insert on one unknown column, which would take the apply flow down.
 */
const CONTACT_SMS_CONSENT_FIELD = process.env.SF_CONTACT_SMS_FIELD ?? "sms_opt_in__c";

const contactFieldSupport = new Map<string, Promise<boolean>>();

/**
 * Whether Contact actually exposes a writable field, cached per process.
 *
 * Consent is only ever sent when the org has somewhere to put it. If the field
 * does not exist the application still succeeds — losing the consent flag is
 * bad, losing the candidate is worse — and the miss is logged so it can be
 * created.
 */
async function contactAcceptsField(name: string): Promise<boolean> {
  const cached = contactFieldSupport.get(name);
  if (cached) return cached;

  const lookup = (async () => {
    try {
      const describe = (await salesforceGet(
        `/services/data/${API_VERSION}/sobjects/Contact/describe`,
      )) as { fields?: Array<{ name: string; updateable?: boolean }> };
      const field = (describe.fields ?? []).find((f) => f.name === name);
      const usable = !!field && field.updateable !== false;
      if (!usable) {
        console.warn(
          `[salesforce] Contact has no writable "${name}" — SMS consent is collected on the form but not stored. Create the field, or set SF_CONTACT_SMS_FIELD to its API name.`,
        );
      }
      return usable;
    } catch (error) {
      console.error("[salesforce] contact describe failed", error);
      return false;
    }
  })();

  contactFieldSupport.set(name, lookup);
  return lookup;
}

let specialtyCache: { at: number; values: string[] } | null = null;

/**
 * Specialty options, read from the Contact picklist rather than hardcoded.
 *
 * The list runs to dozens of entries and Salesforce is the system of record —
 * baking a copy into the bundle would drift the moment someone edits it there.
 */
export async function getSpecialtyOptions(): Promise<string[]> {
  if (specialtyCache && Date.now() - specialtyCache.at < 6 * 3600_000) return specialtyCache.values;

  const config = await getConfig();
  if ("missing" in config) return [];

  try {
    const describe = (await salesforceGet(
      `/services/data/${API_VERSION}/sobjects/Contact/describe`,
    )) as {
      fields?: Array<{ name: string; picklistValues?: Array<{ value: string; active: boolean }> }>;
    };
    const field = (describe.fields ?? []).find((f) => f.name === CONTACT_SPECIALTY_FIELD);
    const values = (field?.picklistValues ?? [])
      .filter((v) => v.active)
      .map((v) => v.value)
      .sort((a, b) => a.localeCompare(b));
    specialtyCache = { at: Date.now(), values };
    return values;
  } catch (error) {
    console.error("[salesforce] specialty options failed", error);
    return [];
  }
}

/* ------------------------------------------------------------------ *
 * Resume upload
 * ------------------------------------------------------------------ */

/**
 * Vercel caps a serverless request body at 4.5 MB and base64 inflates by a
 * third, so the raw file has to stay meaningfully under that.
 */
export const MAX_RESUME_BYTES = 3 * 1024 * 1024;
export const ALLOWED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export type ResumeUpload = { filename: string; contentType: string; base64: string };

/**
 * Store the resume as a Salesforce File and link it to both the application and
 * the provider's own record — recruiters look in both places.
 */
async function attachResume(
  resume: ResumeUpload,
  linkTo: string[],
  candidateName: string,
): Promise<void> {
  const version = await salesforcePost(`/services/data/${API_VERSION}/sobjects/ContentVersion`, {
    Title: `Resume — ${candidateName}`,
    PathOnClient: resume.filename,
    VersionData: resume.base64,
    Origin: "H",
  });

  const doc = (await salesforceGet(
    `/services/data/${API_VERSION}/sobjects/ContentVersion/${String(version.id)}?fields=ContentDocumentId`,
  )) as { ContentDocumentId?: string };
  if (!doc.ContentDocumentId) return;

  for (const recordId of linkTo) {
    try {
      await salesforcePost(`/services/data/${API_VERSION}/sobjects/ContentDocumentLink`, {
        ContentDocumentId: doc.ContentDocumentId,
        LinkedEntityId: recordId,
        ShareType: "V",
        Visibility: "AllUsers",
      });
    } catch (error) {
      // A failed link shouldn't lose the application the file belongs to.
      console.error("[salesforce] resume link failed", recordId, error);
    }
  }
}

