import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { Tool } from "@/data/tools";
import { getRelatedTools } from "@/data/tools";
import { ToolCard } from "./ToolCard";

export function ToolShell({ tool, children }: { tool: Tool; children: ReactNode }) {
  const Icon = tool.Icon;
  const related = getRelatedTools(tool.slug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-text-faint">
        <Link to="/tools" className="hover:text-text-secondary">Tools</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/tools/$slug" params={{ slug: tool.category }} className="hover:text-text-secondary">
          {tool.categoryName}
        </Link>
      </nav>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-primary-soft text-primary">
          <Icon className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-2xl font-semibold sm:text-3xl">{tool.name}</h1>
            <span className="rounded-sm border border-accent-green/30 bg-accent-green/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-green">
              Free
            </span>
          </div>
          <p className="mt-1 text-sm text-text-muted">{tool.description}</p>
        </div>
      </header>

      <section className="mt-8">
        <div className="rounded-md border border-border-muted bg-card p-4 sm:p-6">
          {children}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-heading text-lg font-semibold">Related tools</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <ToolCard key={r.slug} tool={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function ToolSection({ title, children, hint }: { title?: string; children: ReactNode; hint?: string }) {
  return (
    <div className="space-y-2">
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold text-text-primary">{title}</h3>
          {hint && <p className="text-xs text-text-faint">{hint}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
