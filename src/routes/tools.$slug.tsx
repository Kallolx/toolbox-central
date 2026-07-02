import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowRight, Upload } from "lucide-react";
import { ToolGrid } from "@/components/shared/ToolCard";
import { ToolShell } from "@/components/shared/ToolShell";
import { ToolComponents } from "@/components/tools/registry";
import { getCategoryBySlug, getToolBySlug, getToolsByCategory, type Tool } from "@/data/tools";

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
      return { meta: [{ title: "Not found - Toolune" }, { name: "robots", content: "noindex" }] };
    }
    if (loaderData.kind === "tool") {
      const tool = loaderData.tool;
      const title = `${tool.name} - Toolune`;
      const desc = `${tool.description} Free online tool. No signup needed.`;
      return {
        meta: [
          { title },
          { name: "description", content: desc },
          { property: "og:title", content: title },
          { property: "og:description", content: desc },
        ],
      };
    }
    const category = loaderData.category;
    return {
      meta: [
        { title: `${category.name} - Toolune` },
        { name: "description", content: category.description },
        { property: "og:title", content: `${category.name} - Toolune` },
        { property: "og:description", content: category.description },
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
      <ToolShell tool={data.tool}>{Comp ? <Comp /> : <ToolFallback tool={data.tool} />}</ToolShell>
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

function ToolFallback({ tool }: { tool: Tool }) {
  return (
    <div className="space-y-5">
      <div className="rounded-md border border-dashed border-border-muted bg-surface p-6">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-primary-soft text-primary">
          <Upload className="h-5 w-5" />
        </span>
        <h2 className="mt-4 font-heading text-lg font-semibold">{tool.name}</h2>
        <p className="mt-1 max-w-xl text-sm text-text-muted">
          This browser-first tool is part of the new Toolune set. The working interface is being
          prepared carefully so it stays free, private, and simple.
        </p>
        <div className="mt-4 rounded-md border border-border-muted bg-card px-3 py-2 text-xs text-text-faint">
          Most tools run in your browser. We do not store your files.
        </div>
      </div>
    </div>
  );
}

function SlugNotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-heading text-2xl font-semibold">Not found</h1>
      <p className="mt-2 text-sm text-text-muted">This tool or category does not exist.</p>
      <a
        href="/tools"
        className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        All tools <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}
