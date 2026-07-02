import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Shield, Sparkles, Zap } from "lucide-react";
import { ToolCard } from "@/components/shared/ToolCard";
import { categories, popularTools, tools } from "@/data/tools";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const heroCards = popularTools.slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-primary-soft to-transparent opacity-70" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border-muted bg-surface px-2.5 py-1 text-xs text-text-secondary">
                <Sparkles className="h-3 w-3 text-primary" />
                Free forever - no signup
              </span>
              <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Free tools for <span className="text-gradient-brand">everyday work</span>
              </h1>
              <p className="mt-4 max-w-xl text-base text-text-secondary sm:text-lg">
                PDF, photo, print, scan, QR, student, office, and business tools. No signup needed.
              </p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Link
                  to="/tools"
                  className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-5 py-2.5 font-heading text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Explore Tools <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#popular"
                  className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-5 py-2.5 font-heading text-sm font-medium text-text-primary transition-colors hover:bg-surface-2"
                >
                  Popular Tools
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {heroCards.map((tool, index) => (
                <div key={tool.slug} className={index % 2 === 1 ? "sm:translate-y-6" : ""}>
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="popular" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">Popular tools</h2>
            <p className="mt-1 text-sm text-text-muted">
              Useful tools for print shops, students, offices, and small businesses.
            </p>
          </div>
          <Link
            to="/tools"
            className="hidden text-sm text-text-secondary hover:text-text-primary sm:inline-flex"
          >
            {"View all ->"}
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">Browse by category</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const count = tools.filter((tool) => tool.category === category.slug).length;
            return (
              <Link
                key={category.slug}
                to="/tools/$slug"
                params={{ slug: category.slug }}
                className="group flex flex-col rounded-md border border-border-muted bg-card p-5 transition-colors hover:border-border hover:bg-surface-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-heading text-lg font-semibold">{category.name}</h3>
                  <span className="text-xs text-text-faint">{count} tools</span>
                </div>
                <p className="mt-1 text-sm text-text-muted">{category.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary transition-transform group-hover:translate-x-0.5">
                  Browse <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-md border border-border-muted bg-card p-6 sm:p-10">
          <div className="grid gap-8 sm:grid-cols-3">
            <Feature
              icon={<Sparkles className="h-4 w-4" />}
              title="Simple and free"
              desc="No signup, no paid API, no usage cap."
            />
            <Feature
              icon={<Shield className="h-4 w-4" />}
              title="Private by default"
              desc="Most tools run in your browser. We do not store your files."
            />
            <Feature
              icon={<Zap className="h-4 w-4" />}
              title="Fast and focused"
              desc="Upload, choose a simple option, then download or copy."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div>
      <span className="grid h-8 w-8 place-items-center rounded-md bg-primary-soft text-primary">
        {icon}
      </span>
      <h3 className="mt-3 font-heading text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-text-muted">{desc}</p>
    </div>
  );
}
