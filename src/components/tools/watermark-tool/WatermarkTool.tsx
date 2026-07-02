import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { UploadBox } from "@/components/shared/UploadBox";
import { canvasToBlob, fileToDataURL, loadImage, stripExt } from "@/lib/image";
import { download } from "@/lib/download";

type Pos = "tl" | "tr" | "c" | "bl" | "br";
const positions: { key: Pos; label: string }[] = [
  { key: "tl", label: "Top Left" }, { key: "tr", label: "Top Right" },
  { key: "c", label: "Center" }, { key: "bl", label: "Bottom Left" }, { key: "br", label: "Bottom Right" },
];

export function WatermarkTool() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("© Toolune");
  const [pos, setPos] = useState<Pos>("br");
  const [opacity, setOpacity] = useState(60);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!file) return;
    (async () => {
      const src = await fileToDataURL(file);
      const img = await loadImage(src);
      const canvas = canvasRef.current!;
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const fontSize = Math.max(24, Math.round(img.naturalWidth / 25));
      ctx.font = `600 ${fontSize}px "Outfit", system-ui, sans-serif`;
      ctx.fillStyle = `rgba(255,255,255,${opacity / 100})`;
      ctx.textBaseline = "middle";
      const m = ctx.measureText(text);
      const pad = fontSize * 0.6;
      let x = pad, y = pad + fontSize / 2;
      if (pos === "tr") x = canvas.width - m.width - pad;
      if (pos === "c") { x = (canvas.width - m.width) / 2; y = canvas.height / 2; }
      if (pos === "bl") y = canvas.height - pad - fontSize / 2;
      if (pos === "br") { x = canvas.width - m.width - pad; y = canvas.height - pad - fontSize / 2; }
      ctx.fillText(text, x, y);
      setRendered(true);
    })();
  }, [file, text, pos, opacity]);

  const onDownload = async () => {
    if (!file) return toast.error("Please upload an image first.");
    const blob = await canvasToBlob(canvasRef.current!, "image/png");
    download(blob, `${stripExt(file.name)}-watermarked.png`);
  };

  return (
    <div className="space-y-5">
      <UploadBox accept="image/*" file={file} onFileChange={(f) => { setFile(f); setRendered(false); }} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">Watermark text</label>
          <input value={text} onChange={(e) => setText(e.target.value)} className="h-10 w-full rounded-md border border-border-muted bg-surface px-3 text-sm text-text-primary focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 flex justify-between text-xs font-medium text-text-secondary">Opacity <span className="text-text-muted">{opacity}%</span></label>
          <input type="range" min={10} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="mt-3 w-full accent-[#7C3AED]" />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">Position</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {positions.map((p) => (
            <button key={p.key} onClick={() => setPos(p.key)} className={"rounded-md border px-3 py-2 text-xs " + (pos === p.key ? "border-primary bg-primary-soft text-primary" : "border-border-muted bg-surface text-text-secondary hover:bg-surface-2")}>{p.label}</button>
          ))}
        </div>
      </div>
      <div className={"rounded-md border border-border-muted bg-surface p-4 " + (rendered ? "" : "hidden")}>
        <canvas ref={canvasRef} className="max-h-72 w-full object-contain" />
      </div>
      <button onClick={onDownload} disabled={!file} className="w-full rounded-md bg-primary py-2.5 font-heading text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-50">Download</button>
    </div>
  );
}
