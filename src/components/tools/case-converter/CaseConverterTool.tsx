import { useState } from "react";
import { CopyButton } from "@/components/shared/CopyButton";

const toTitle = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const toSentence = (s: string) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
const toSlug = (s: string) => s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
const toCamel = (s: string) => {
  const parts = s.trim().split(/[^a-zA-Z0-9]+/).filter(Boolean);
  return parts.map((p, i) => (i === 0 ? p.toLowerCase() : p[0].toUpperCase() + p.slice(1).toLowerCase())).join("");
};

export function CaseConverterTool() {
  const [text, setText] = useState("");
  const [out, setOut] = useState("");

  return (
    <div className="space-y-5">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder="Type or paste text..." className="w-full rounded-md border border-border-muted bg-surface p-3 text-sm text-text-primary focus:border-primary focus:outline-none" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Btn onClick={() => setOut(text.toUpperCase())}>UPPERCASE</Btn>
        <Btn onClick={() => setOut(text.toLowerCase())}>lowercase</Btn>
        <Btn onClick={() => setOut(toTitle(text))}>Title Case</Btn>
        <Btn onClick={() => setOut(toSentence(text))}>Sentence case</Btn>
        <Btn onClick={() => setOut(toSlug(text))}>slug-case</Btn>
        <Btn onClick={() => setOut(toCamel(text))}>camelCase</Btn>
      </div>
      <textarea value={out} readOnly rows={5} className="w-full rounded-md border border-border-muted bg-surface p-3 text-sm text-text-primary focus:border-primary focus:outline-none" />
      <CopyButton value={out} label="Copy Result" />
    </div>
  );
}
function Btn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (<button onClick={onClick} className="rounded-md border border-border-muted bg-surface px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-2 hover:text-text-primary">{children}</button>);
}
