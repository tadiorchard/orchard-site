import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

/** TEMPORARY read-only diagnostic. No writes. Deleted immediately after use. */
const run = createServerFn({ method: "GET" }).handler(async () => {
  const { newestApplication } = await import("@/lib/salesforce.server");
  return JSON.stringify(await newestApplication(), null, 2);
});

export const Route = createFileRoute("/newest-app-8d4b2f")({
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
