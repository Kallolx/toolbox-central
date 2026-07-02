import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Menu, Search, Sparkles, X } from "lucide-react";
import { categories, getToolsByCategory } from "@/data/tools";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuGroups = categories.map((category) => ({
    category,
    tools: getToolsByCategory(category.slug).slice(0, 4),
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-border-muted bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-brand">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight">Toolune</span>
        </Link>

        <nav className="ml-6 hidden flex-1 items-center gap-1 lg:flex">
          {menuGroups.map(({ category, tools }) => (
            <div
              key={category.slug}
              className="relative"
              onMouseEnter={() => setActiveMenu(category.slug)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="inline-flex h-9 items-center justify-center rounded-md bg-transparent px-3 py-2 text-sm font-normal text-text-secondary transition-colors hover:bg-surface hover:text-text-primary">
                {category.navName}
                <ChevronDown
                  className={cn(
                    "ml-1 h-3.5 w-3.5 transition-transform",
                    activeMenu === category.slug && "rotate-180",
                  )}
                />
              </button>

              {activeMenu === category.slug && (
                <div className="absolute left-0 top-full z-50 pt-3">
                  <div className="grid w-[19rem] gap-3 rounded-2xl border border-border-muted bg-popover p-3 shadow-xl md:w-[26rem] md:grid-cols-[0.95fr_1.05fr] md:p-4">
                    <div className="overflow-hidden rounded-xl border border-border-muted bg-surface">
                      <img
                        src="/images/pdf.png"
                        alt={`${category.name} menu preview`}
                        className="h-full min-h-[13rem] w-full object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      {tools.map((tool) => (
                        <Link
                          key={tool.slug}
                          to={tool.href}
                          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
                        >
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary-soft text-primary">
                            <tool.Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block font-medium leading-tight text-text-primary">
                              {tool.name}
                            </span>
                          </span>
                        </Link>
                      ))}

                      <Link
                        to="/tools/$slug"
                        params={{ slug: category.slug }}
                        className="mt-2 inline-flex items-center gap-1 px-3 text-sm font-medium text-primary hover:text-primary-hover"
                      >
                        View all {category.navName}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/donate"
            className="hidden rounded-md bg-primary px-3.5 py-2 font-heading text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover md:inline-flex"
          >
            Donate
          </Link>
          <button
            aria-label="Toggle menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-muted text-text-secondary lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border-muted bg-surface lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            <SearchInput />
            <div className="grid grid-cols-1 gap-2">
              {menuGroups.map(({ category, tools }) => (
                <details key={category.slug} className="group rounded-md border border-border-muted bg-card">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-medium text-text-primary">
                    {category.navName}
                    <span className="text-xs text-text-muted group-open:rotate-180">⌄</span>
                  </summary>
                  <div className="space-y-1 border-t border-border-muted px-2 py-2">
                    {tools.map((tool) => (
                      <Link
                        key={tool.slug}
                        to={tool.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-2 py-2 text-sm text-text-secondary hover:bg-surface hover:text-text-primary"
                      >
                        {tool.name}
                      </Link>
                    ))}
                    <Link
                      to="/tools/$slug"
                      params={{ slug: category.slug }}
                      onClick={() => setOpen(false)}
                      className="mt-1 flex items-center gap-1 rounded-md px-2 py-2 text-sm font-medium text-primary hover:bg-surface hover:text-primary-hover"
                    >
                      View all {category.navName}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </details>
              ))}
              <Link
                to="/donate"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-md bg-primary px-3 py-2 text-center font-heading text-sm font-medium text-primary-foreground"
              >
                Donate
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function SearchInput({ className }: { className?: string }) {
  return (
    <form
      action="/tools"
      method="get"
      className={cn(
        "relative flex h-9 items-center rounded-md border border-border-muted bg-surface pl-8 pr-2",
        className,
      )}
    >
      <Search className="pointer-events-none absolute left-2.5 h-4 w-4 text-text-muted" />
      <input
        name="q"
        placeholder="Search tools..."
        className="h-full w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none md:w-56"
      />
    </form>
  );
}
