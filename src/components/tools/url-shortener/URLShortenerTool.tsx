import { useState } from "react";
import { toast } from "sonner";
import { CopyButton } from "@/components/shared/CopyButton";

// TODO: Wire to backend + database when ready. This is a frontend-only mock.
export function URLShortenerTool() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [short, setShort] = useState("");

  const onShorten = () => {
    const v = url.trim();
    if (!v) return toast.error("Enter a URL first.");
    try { new URL(v); } catch { return toast.error("Enter a valid URL."); }
    const id = alias.trim() || Math.random().toString(36).slice(2, 8);
    setShort(`https://toolune.com/s/${id}`);
    toast.success("Short link generated (demo).");
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block text-xs font-medium text-text-secondary">Long URL</label>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/some/very/long/link" className="h-10 w-full rounded-md border border-border-muted bg-surface px-3 text-sm text-text-primary focus:border-primary focus:outline-none" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-text-secondary">Custom alias (optional)</label>
        <input value={alias} onChange={(e) => setAlias(e.target.value.replace(/[^a-z0-9-]/gi, ""))} placeholder="my-link" className="h-10 w-full rounded-md border border-border-muted bg-surface px-3 text-sm text-text-primary focus:border-primary focus:outline-none" />
      </div>
      <button onClick={onShorten} className="w-full rounded-md bg-primary py-2.5 font-heading text-sm font-medium text-primary-foreground hover:bg-primary-hover">Shorten</button>
      {short && (
        <div className="rounded-md border border-border-muted bg-surface p-4">
          <p className="text-xs text-text-faint">Your short link (demo)</p>
          <p className="mt-1 break-all font-mono text-sm text-text-primary">{short}</p>
          <div className="mt-3"><CopyButton value={short} /></div>
          <p className="mt-3 text-xs text-text-faint">This tool is a preview. Real redirects need a backend.</p>
        </div>
      )}
    </div>
  );
}
