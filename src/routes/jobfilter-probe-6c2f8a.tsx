import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

/** TEMPORARY. Schema + aggregate counts only. No record data, no writes. */
const run = createServerFn({ method: "GET" }).handler(async () => {
  const { probeJobFilters } = await import("@/lib/salesforce.server");
  return JSON.stringify(await probeJobFilters(), null, 2);
});

export const Route = createFileRoute("/jobfilter-probe-6c2f8a")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  loader: async () => ({ report: await run() }),
  component: () => {
    const { report } = Route.useLoaderData();
    return (
      <main style={{ padding: 24, fontFamily: "ui-monospace, monospace", fontSize: 12 }}>
        <pre style={{ whiteSpace: "pre-wrap" }}>{report}</pre>
      </main>
    );
  },
});
