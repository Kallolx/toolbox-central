import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Tool } from "@/data/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.Icon;
  return (
    <Link
      to="/tools/$slug"
      params={{ slug: tool.slug }}
      className="group relative flex flex-col rounded-md border border-border-muted bg-card p-5 transition-colors hover:border-border hover:bg-surface-2"
    >
      <div className="flex items-start justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-primary-soft text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <ArrowRight className="h-4 w-4 text-text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-text-primary" />
      </div>
      <h3 className="mt-4 font-heading text-base font-semibold text-text-primary">{tool.name}</h3>
      <p className="mt-1 text-sm text-text-muted">{tool.description}</p>
    </Link>
  );
}

export function ToolGrid({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border-muted bg-card p-8 text-center text-sm text-text-muted">
        No tools match your search.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((t) => (
        <ToolCard key={t.slug} tool={t} />
      ))}
    </div>
  );
}
