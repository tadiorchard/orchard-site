import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

/**
 * TEMPORARY — delete once the apply flow is built.
 *
 * Describes nuProducts__Candidate_Tracking__c so the application writer can be
 * built against the real schema. Existing records are reported as field names
 * and whether they carry a value; free-text and personal fields are never
 * echoed, because this route is publicly reachable while it exists.
 */

const inspect = createServerFn({ method: "GET" }).handler(async () => {
  const { inspectCandidateTracking } = await import("@/lib/salesforce.server");
  return JSON.stringify(await inspectCandidateTracking(), null, 2);
});

export const Route = createFileRoute("/ct-inspect-7b2e1d")({
  head: () => ({
    meta: [{ title: "CT inspect" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  loader: async () => ({ report: await inspect() }),
  component: Inspect,
});

function Inspect() {
  const { report } = Route.useLoaderData();
  return (
    <main style={{ padding: 24, fontFamily: "ui-monospace, monospace", fontSize: 12 }}>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{report}</pre>
    </main>
  );
}
