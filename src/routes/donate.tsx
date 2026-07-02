import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/donate")({
  component: DonatePage,
  head: () => ({
    meta: [
      { title: "Donate - Toolune" },
      {
        name: "description",
        content: "Support Toolune and help keep the tools free and private.",
      },
    ],
  }),
});

function DonatePage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Support</p>
      <h1 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">Donate to Toolune</h1>
      <p className="mt-4 max-w-xl text-sm leading-6 text-text-muted">
        This page is reserved for a future donation link or sponsor flow. It keeps the navbar
        action in place without sending users to a dead end.
      </p>
    </div>
  );
}