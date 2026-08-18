import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

/** TEMPORARY read-only diagnostic. No writes. Deleted once the form is proven. */
const run = createServerFn({ method: "GET" }).handler(async () => {
  const { recentApplications } = await import("@/lib/salesforce.server");
  return JSON.stringify(await recentApplications(), null, 2);
});

export const Route = createFileRoute("/recent-apps-3e9a7c")({
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
