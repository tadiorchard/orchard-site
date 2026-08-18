import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

/** TEMPORARY. Schema metadata only — no record data, no writes. */
const run = createServerFn({ method: "GET" }).handler(async () => {
  const { probeContactFields } = await import("@/lib/salesforce.server");
  return JSON.stringify(await probeContactFields(), null, 2);
});

export const Route = createFileRoute("/schema-probe-5a1c9e")({
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
