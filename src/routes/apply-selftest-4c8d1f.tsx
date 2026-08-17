import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

/** TEMPORARY — verifies the apply write path once, then gets deleted. */
const run = createServerFn({ method: "GET" }).handler(async () => {
  const { applicationSelfTest } = await import("@/lib/salesforce.server");
  return JSON.stringify(await applicationSelfTest(), null, 2);
});

export const Route = createFileRoute("/apply-selftest-4c8d1f")({
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
