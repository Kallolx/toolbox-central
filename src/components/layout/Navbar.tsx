import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, X, Sparkles } from "lucide-react";
import { categories } from "@/data/tools";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border-muted bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-brand">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight">Toolune</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/tools/$slug"
              params={{ slug: c.slug }}
              className="rounded-md px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
              activeProps={{ className: "text-text-primary bg-surface" }}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchInput className="hidden md:flex" />
          <Link
            to="/tools"
            className="hidden rounded-md bg-primary px-3.5 py-2 font-heading text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover md:inline-flex"
          >
            All Tools
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
            <div className="grid grid-cols-1 gap-1">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to="/tools/$slug"
                  params={{ slug: c.slug }}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                >
                  {c.name}
                </Link>
              ))}
              <Link
                to="/tools"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-md bg-primary px-3 py-2 text-center font-heading text-sm font-medium text-primary-foreground"
              >
                All Tools
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
