import { useEffect, useState } from "react";
import { Lock, Unlock, RefreshCw, Check } from "lucide-react";

const rand = () => {
  const h = Math.floor(Math.random() * 360);
  const s = 55 + Math.floor(Math.random() * 25);
  const l = 45 + Math.floor(Math.random() * 20);
  return hslToHex(h, s, l);
};

function hslToHex(h: number, s: number, l: number) {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const to = (n: number) => Math.round(255 * f(n)).toString(16).padStart(2, "0");
  return `#${to(0)}${to(8)}${to(4)}`.toUpperCase();
}

export function ColorPaletteGeneratorTool() {
  const [palette, setPalette] = useState<string[]>(() => Array.from({ length: 5 }, rand));
  const [locked, setLocked] = useState<boolean[]>([false, false, false, false, false]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const regen = () => setPalette((p) => p.map((c, i) => (locked[i] ? c : rand())));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.code === "Space" && e.target === document.body) { e.preventDefault(); regen(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const copy = async (c: string, i: number) => {
    await navigator.clipboard.writeText(c);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 1200);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {palette.map((c, i) => (
          <button key={i} onClick={() => copy(c, i)} className="group relative flex h-32 flex-col justify-end rounded-md border border-border-muted p-3 text-left" style={{ background: c }}>
            <span className="rounded-sm bg-black/50 px-1.5 py-0.5 font-mono text-xs text-white">{c}</span>
            <button
              onClick={(e) => { e.stopPropagation(); setLocked((l) => l.map((v, j) => (j === i ? !v : v))); }}
              className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-sm bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label={locked[i] ? "Unlock" : "Lock"}
            >
              {locked[i] ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
            </button>
            {copiedIdx === i && (
              <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
                <Check className="h-3 w-3" /> Copied
              </span>
            )}
          </button>
        ))}
      </div>
      <button onClick={regen} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 font-heading text-sm font-medium text-primary-foreground hover:bg-primary-hover">
        <RefreshCw className="h-4 w-4" /> Generate Palette
      </button>
      <p className="text-center text-xs text-text-faint">Click any color to copy • Press space to regenerate</p>
    </div>
  );
}
