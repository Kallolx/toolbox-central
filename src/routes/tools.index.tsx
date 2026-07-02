import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { z } from "zod";
import { ToolGrid } from "@/components/shared/ToolCard";
import { categories, tools } from "@/data/tools";

const search = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/tools/")({
  validateSearch: search,
  component: ToolsIndex,
  head: () => ({
    meta: [
      { title: "All Tools - Toolune" },
      {
        name: "description",
        content: "Browse free PDF, photo, print, scan, QR, student, office, and business tools.",
      },
      { property: "og:title", content: "All Tools - Toolune" },
      { property: "og:description", content: "Browse every free everyday tool on Toolune." },
    ],
  }),
});

function ToolsIndex() {
  const { q } = Route.useSearch();
  const [query, setQuery] = useState(q ?? "");
  const [activeCat, setActiveCat] = useState<string>("all");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return tools.filter((tool) => {
      if (activeCat !== "all" && tool.category !== activeCat) return false;
      if (!term) return true;
      return (
        tool.name.toLowerCase().includes(term) ||
        tool.description.toLowerCase().includes(term) ||
        tool.categoryName.toLowerCase().includes(term) ||
        tool.keywords.some((keyword) => keyword.toLowerCase().includes(term))
      );
    });
  }, [query, activeCat]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">All tools</h1>
        <p className="text-sm text-text-muted">
          {tools.length} free PDF, photo, scan, QR, student, office, and business tools.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex h-10 flex-1 items-center rounded-md border border-border-muted bg-surface pl-9">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search PDF, passport photo, QR, invoice..."
            className="h-full w-full bg-transparent pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <FilterChip active={activeCat === "all"} onClick={() => setActiveCat("all")}>
          All
        </FilterChip>
        {categories.map((category) => (
          <FilterChip
            key={category.slug}
            active={activeCat === category.slug}
            onClick={() => setActiveCat(category.slug)}
          >
            {category.navName}
          </FilterChip>
        ))}
      </div>

      <div className="mt-8">
        <ToolGrid tools={filtered} />
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors " +
        (active
          ? "border-primary bg-primary-soft text-primary"
          : "border-border-muted bg-surface text-text-secondary hover:bg-surface-2 hover:text-text-primary")
      }
    >
      {children}
    </button>
  );
}
