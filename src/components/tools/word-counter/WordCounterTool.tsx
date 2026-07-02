import { useMemo, useState } from "react";

export function WordCounterTool() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = (trimmed.match(/[.!?]+(\s|$)/g) || []).length;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).length : 0;
    const reading = Math.max(1, Math.round(words / 200));
    return { words, chars, charsNoSpaces, sentences, paragraphs, reading };
  }, [text]);

  const items = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.chars },
    { label: "Without spaces", value: stats.charsNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Reading time", value: `${stats.reading} min` },
  ];

  return (
    <div className="space-y-5">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Start typing or paste your text..." className="w-full rounded-md border border-border-muted bg-surface p-3 text-sm text-text-primary focus:border-primary focus:outline-none" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.label} className="rounded-md border border-border-muted bg-surface p-4">
            <p className="text-xs text-text-faint">{it.label}</p>
            <p className="mt-1 font-heading text-2xl font-semibold text-text-primary">{it.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
