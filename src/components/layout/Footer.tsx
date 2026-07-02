import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { categories } from "@/data/tools";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border-muted bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-brand">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="font-heading text-lg font-semibold">Toolune</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-text-muted">
            Toolune is a free collection of simple online tools for everyday work.
          </p>
          <p className="mt-1 text-sm text-text-muted">Built by Softune.</p>
          <p className="mt-3 max-w-sm text-xs text-text-faint">
            Most tools run in your browser. We do not store your files.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold">Categories</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  to="/tools/$slug"
                  params={{ slug: category.slug }}
                  className="text-text-secondary hover:text-text-primary"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold">Toolune</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/tools" className="text-text-secondary hover:text-text-primary">
                All tools
              </Link>
            </li>
            <li>
              <Link to="/" className="text-text-secondary hover:text-text-primary">
                Home
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border-muted">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-text-faint sm:px-6 lg:px-8">
          (c) {new Date().getFullYear()} Toolune. Built by Softune.
        </div>
      </div>
    </footer>
  );
}
