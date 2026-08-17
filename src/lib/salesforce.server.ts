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

/** Field API names we display, in priority order, if the object has them. */
const PREFERRED_FIELDS = [
  "nuProducts__Job_Title__c",
  "nuProducts__Location_State_Province__c",
  "nuProducts__Location_City__c",
  "nuProducts__Specialties__c",
  "nuProducts__Provider_Type__c",
  "nuProducts__Job_Description__c",
  "nuProducts__Description__c",
  "nuProducts__Start_Date__c",
  "nuProducts__Duration__c",
  "nuProducts__Rate__c",
  "nuProducts__Status__c",
] as const;

export type Job = {
  id: string;
  title: string;
  state: string | null;
  city: string | null;
  specialty: string | null;
  providerType: string | null;
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
    loginUrl: (readEnv("SALESFORCE_LOGIN_URL") ?? "https://login.salesforce.com").replace(/\/+$/, ""),
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
  const contentLength =
    version.length + algorithm.length + keyOctetHeader.length + pkcs1.length;
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
async function resolveQueryFields(jobObject: string): Promise<string[]> {
  const describe = (await salesforceGet(
    `/services/data/${API_VERSION}/sobjects/${jobObject}/describe`,
  )) as { fields?: Array<{ name: string }> };

  const available = new Set((describe.fields ?? []).map((f) => f.name));
  const fields = ["Id", "Name", "CreatedDate", "LastModifiedDate"].filter((f) => available.has(f));
  for (const field of PREFERRED_FIELDS) if (available.has(field)) fields.push(field);
  return fields;
}

function pick(record: Record<string, unknown>, ...names: string[]): string | null {
  for (const name of names) {
    const value = record[name];
    if (value != null && String(value).trim() !== "") return String(value).trim();
  }
  return null;
}

function toJob(record: Record<string, unknown>): Job {
  return {
    id: String(record.Id ?? ""),
    title: pick(record, "nuProducts__Job_Title__c", "Name") ?? "Untitled position",
    state: pick(record, "nuProducts__Location_State_Province__c"),
    city: pick(record, "nuProducts__Location_City__c"),
    specialty: pick(record, "nuProducts__Specialties__c"),
    providerType: pick(record, "nuProducts__Provider_Type__c"),
    description: pick(record, "nuProducts__Job_Description__c", "nuProducts__Description__c"),
    startDate: pick(record, "nuProducts__Start_Date__c"),
    duration: pick(record, "nuProducts__Duration__c"),
    postedAt: pick(record, "CreatedDate"),
  };
}

export async function fetchJobs(): Promise<JobsResult> {
  if (jobsCache && Date.now() - jobsCache.at < JOBS_TTL_MS) return jobsCache.result;

  const config = await getConfig();
  if ("missing" in config) return { status: "unconfigured", missing: config.missing };

  let result: JobsResult;
  try {
    const fields = await resolveQueryFields(config.jobObject);
    const soql =
      `SELECT ${fields.join(", ")} FROM ${config.jobObject} ` +
      `ORDER BY LastModifiedDate DESC LIMIT 200`;
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
