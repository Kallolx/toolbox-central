import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { ToolCard } from "@/components/shared/ToolCard";
import { popularTools, categories, tools } from "@/data/tools";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const heroCards = tools
    .filter((t) => ["image-converter", "image-compressor", "qr-code-generator", "text-cleaner"].includes(t.slug))
    .sort(
      (a, b) =>
        ["image-converter", "image-compressor", "qr-code-generator", "text-cleaner"].indexOf(a.slug) -
        ["image-converter", "image-compressor", "qr-code-generator", "text-cleaner"].indexOf(b.slug),
    );

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-primary-soft to-transparent opacity-60" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border-muted bg-surface px-2.5 py-1 text-xs text-text-secondary">
                <Sparkles className="h-3 w-3 text-primary" />
                20+ free tools • No signup
              </span>
              <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Free online tools for{" "}
                <span className="text-gradient-brand">everyday tasks</span>
              </h1>
              <p className="mt-4 max-w-lg text-base text-text-secondary sm:text-lg">
                Simple image, link, text, color, and utility tools. No signup needed.
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
              {heroCards.map((t, i) => (
                <div
                  key={t.slug}
                  className={i % 2 === 1 ? "sm:translate-y-6" : ""}
                >
                  <ToolCard tool={t} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular */}
      <section id="popular" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">Popular tools</h2>
            <p className="mt-1 text-sm text-text-muted">Most used tools on Toolune.</p>
          </div>
          <Link to="/tools" className="hidden text-sm text-text-secondary hover:text-text-primary sm:inline-flex">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularTools.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">Browse by category</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const count = tools.filter((t) => t.category === c.slug).length;
            return (
              <Link
                key={c.slug}
                to="/tools/$slug"
                params={{ slug: c.slug }}
                className="group flex flex-col rounded-md border border-border-muted bg-card p-5 transition-colors hover:border-border hover:bg-surface-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg font-semibold">{c.name}</h3>
                  <span className="text-xs text-text-faint">{count} tools</span>
                </div>
                <p className="mt-1 text-sm text-text-muted">{c.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary transition-transform group-hover:translate-x-0.5">
                  Browse <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-md border border-border-muted bg-card p-6 sm:p-10">
          <div className="grid gap-8 sm:grid-cols-3">
            <Feature
              icon={<Sparkles className="h-4 w-4" />}
              title="Simple and free"
              desc="No signup, no ads, no paid tiers. Every tool is free."
            />
            <Feature
              icon={<Shield className="h-4 w-4" />}
              title="Private by default"
              desc="Most tools run in your browser. We do not store your files."
            />
            <Feature
              icon={<Zap className="h-4 w-4" />}
              title="Fast and focused"
              desc="Each tool does one thing well — upload, click, done."
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
      <span className="grid h-8 w-8 place-items-center rounded-md bg-primary-soft text-primary">{icon}</span>
      <h3 className="mt-3 font-heading text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-text-muted">{desc}</p>
    </div>
  );
}
