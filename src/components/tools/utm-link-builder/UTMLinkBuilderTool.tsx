import { useState } from "react";
import { toast } from "sonner";
import { CopyButton } from "@/components/shared/CopyButton";

export function UTMLinkBuilderTool() {
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [result, setResult] = useState("");

  const onBuild = () => {
    const v = url.trim();
    if (!v) return toast.error("Enter a website URL.");
    let u: URL;
    try { u = new URL(v); } catch { return toast.error("Enter a valid URL."); }
    if (source) u.searchParams.set("utm_source", source);
    if (medium) u.searchParams.set("utm_medium", medium);
    if (campaign) u.searchParams.set("utm_campaign", campaign);
    setResult(u.toString());
  };

  return (
    <div className="space-y-5">
      <Field label="Website URL"><Input value={url} onChange={setUrl} placeholder="https://example.com" /></Field>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Source"><Input value={source} onChange={setSource} placeholder="newsletter" /></Field>
        <Field label="Medium"><Input value={medium} onChange={setMedium} placeholder="email" /></Field>
        <Field label="Campaign"><Input value={campaign} onChange={setCampaign} placeholder="launch" /></Field>
      </div>
      <button onClick={onBuild} className="w-full rounded-md bg-primary py-2.5 font-heading text-sm font-medium text-primary-foreground hover:bg-primary-hover">Generate UTM Link</button>
      {result && (
        <div className="rounded-md border border-border-muted bg-surface p-4">
          <p className="break-all font-mono text-sm">{result}</p>
          <div className="mt-3"><CopyButton value={result} /></div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div><label className="mb-1 block text-xs font-medium text-text-secondary">{label}</label>{children}</div>);
}
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (<input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-10 w-full rounded-md border border-border-muted bg-surface px-3 text-sm text-text-primary focus:border-primary focus:outline-none" />);
}
