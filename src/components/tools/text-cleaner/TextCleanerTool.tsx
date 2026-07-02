import { useState } from "react";
import { CopyButton } from "@/components/shared/CopyButton";

export function TextCleanerTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const apply = (fn: (s: string) => string) => setOutput(fn(input));

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block text-xs font-medium text-text-secondary">Input</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} placeholder="Paste messy text here..." className="w-full rounded-md border border-border-muted bg-surface p-3 text-sm text-text-primary focus:border-primary focus:outline-none" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn onClick={() => apply((s) => s.replace(/[ \t]+/g, " ").replace(/ +\n/g, "\n").trim())}>Remove extra spaces</Btn>
        <Btn onClick={() => apply((s) => s.replace(/\s*\n+\s*/g, " ").trim())}>Remove line breaks</Btn>
        <Btn onClick={() => apply((s) => Array.from(new Set(s.split("\n"))).join("\n"))}>Remove duplicate lines</Btn>
        <Btn onClick={() => { setInput(""); setOutput(""); }}>Clear</Btn>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-text-secondary">Output</label>
        <textarea value={output} readOnly rows={6} className="w-full rounded-md border border-border-muted bg-surface p-3 text-sm text-text-primary focus:border-primary focus:outline-none" />
        <div className="mt-2"><CopyButton value={output} label="Copy Result" /></div>
      </div>
    </div>
  );
}
function Btn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (<button onClick={onClick} className="rounded-md border border-border-muted bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-2 hover:text-text-primary">{children}</button>);
}
