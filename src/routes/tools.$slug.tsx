import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCategoryBySlug, getToolBySlug, getToolsByCategory } from "@/data/tools";
import { ToolShell } from "@/components/shared/ToolShell";
import { ToolGrid } from "@/components/shared/ToolCard";
import { ToolComponents } from "@/components/tools/registry";

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = getToolBySlug(params.slug);
    if (tool) return { kind: "tool" as const, tool };
    const category = getCategoryBySlug(params.slug as never);
    if (category) return { kind: "category" as const, category };
    throw notFound();
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Not found — Toolune" }, { name: "robots", content: "noindex" }] };
    }
    if (loaderData.kind === "tool") {
      const t = loaderData.tool;
      const title = `${t.name} — ${t.description.replace(/\.$/, "")} | Toolune`;
      const desc = `${t.description} Free online ${t.name.toLowerCase()} — no signup, runs in your browser.`;
      return {
        meta: [
          { title },
          { name: "description", content: desc },
          { property: "og:title", content: title },
          { property: "og:description", content: desc },
        ],
      };
    }
    const c = loaderData.category;
    return {
      meta: [
        { title: `${c.name} — Toolune` },
        { name: "description", content: c.description },
        { property: "og:title", content: `${c.name} — Toolune` },
        { property: "og:description", content: c.description },
      ],
    };
  },
  component: ToolOrCategoryPage,
  notFoundComponent: SlugNotFound,
});

function ToolOrCategoryPage() {
  const data = Route.useLoaderData();
  if (data.kind === "tool") {
    const Comp = ToolComponents[data.tool.slug];
    return (
      <ToolShell tool={data.tool}>
        {Comp ? <Comp /> : <ComingSoon />}
      </ToolShell>
    );
  }
  const list = getToolsByCategory(data.category.slug);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold sm:text-4xl">{data.category.name}</h1>
      <p className="mt-1 text-sm text-text-muted">{data.category.description}</p>
      <div className="mt-8">
        <ToolGrid tools={list} />
      </div>
    </div>
  );
}

function ComingSoon() {
  return (
    <div className="rounded-md border border-dashed border-border-muted p-8 text-center text-sm text-text-muted">
      This tool is coming soon.
    </div>
  );
}

function SlugNotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-heading text-2xl font-semibold">Not found</h1>
      <p className="mt-2 text-sm text-text-muted">This tool or category doesn't exist.</p>
      <a href="/tools" className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">All tools</a>
    </div>
  );
}
