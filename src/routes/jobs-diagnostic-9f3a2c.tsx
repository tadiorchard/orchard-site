import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import process from "node:process";

/**
 * TEMPORARY — delete once the Salesforce jobs feed is connected.
 *
 * Reports whether each credential reached the running function and what
 * Salesforce says when we try to exchange them. Booleans, lengths, and error
 * messages only: no credential value is ever read into the response.
 */

const runDiagnostic = createServerFn({ method: "GET" }).handler(async () => {
  const out: Record<string, unknown> = {};

  out.runtime = typeof process !== "undefined" ? `node ${process.version}` : "no process global";
  out.salesforceEnvNamesVisible = Object.keys(process.env ?? {})
    .filter((k) => /SALESFORCE|NITRO|SF_/i.test(k))
    .sort();

  const read = (name: string) => {
    const v = process.env[name];
    return { present: !!v && v.trim() !== "", length: v ? v.length : 0 };
  };
  out.SALESFORCE_CLIENT_ID = read("SALESFORCE_CLIENT_ID");
  out.SALESFORCE_USERNAME = read("SALESFORCE_USERNAME");
  out.SALESFORCE_JWT_PRIVATE_KEY = read("SALESFORCE_JWT_PRIVATE_KEY");
  // Not a secret — showing it catches typos and stray whitespace.
  out.SALESFORCE_LOGIN_URL_value = process.env.SALESFORCE_LOGIN_URL ?? null;

  const key = process.env.SALESFORCE_JWT_PRIVATE_KEY ?? "";
  out.keyFormat = {
    startsWithPkcs8Header: key.trimStart().startsWith("-----BEGIN PRIVATE KEY-----"),
    startsWithPkcs1Header: key.trimStart().startsWith("-----BEGIN RSA PRIVATE KEY-----"),
    hasRealNewlines: key.includes("\n"),
    hasEscapedNewlines: key.includes("\\n"),
  };

  try {
    const { fetchJobs } = await import("@/lib/salesforce.server");
    const result = await fetchJobs();
    out.fetchJobs =
      result.status === "ok"
        ? { status: "ok", jobCount: result.jobs.length, firstTitle: result.jobs[0]?.title ?? null }
        : result;
  } catch (error) {
    out.fetchJobs = { status: "threw", detail: error instanceof Error ? error.message : String(error) };
  }

  return JSON.stringify(out, null, 2);
});

export const Route = createFileRoute("/jobs-diagnostic-9f3a2c")({
  head: () => ({ meta: [{ title: "Jobs diagnostic" }, { name: "robots", content: "noindex, nofollow" }] }),
  loader: async () => ({ report: await runDiagnostic() }),
  component: Diagnostic,
});

function Diagnostic() {
  const { report } = Route.useLoaderData();
  return (
    <main style={{ padding: 24, fontFamily: "ui-monospace, monospace", fontSize: 13 }}>
      <h1 style={{ fontSize: 16, marginBottom: 12 }}>Salesforce jobs diagnostic</h1>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{report}</pre>
    </main>
  );
}
