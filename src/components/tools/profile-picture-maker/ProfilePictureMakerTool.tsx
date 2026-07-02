import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { UploadBox } from "@/components/shared/UploadBox";
import { canvasToBlob, fileToDataURL, loadImage } from "@/lib/image";
import { download } from "@/lib/download";

export function ProfilePictureMakerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [shape, setShape] = useState<"circle" | "square">("circle");
  const [bg, setBg] = useState("#7C3AED");
  const [border, setBorder] = useState(12);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = 512;

  useEffect(() => {
    if (!file) return;
    (async () => {
      const src = await fileToDataURL(file);
      const img = await loadImage(src);
      const canvas = canvasRef.current!;
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);
      ctx.save();
      if (shape === "circle") {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - border, 0, Math.PI * 2);
        ctx.clip();
      } else if (border > 0) {
        ctx.beginPath();
        ctx.rect(border, border, size - border * 2, size - border * 2);
        ctx.clip();
      }
      const s = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - s) / 2;
      const sy = (img.naturalHeight - s) / 2;
      ctx.drawImage(img, sx, sy, s, s, border, border, size - border * 2, size - border * 2);
      ctx.restore();
    })();
  }, [file, shape, bg, border]);

  const onDownload = async () => {
    if (!file) return toast.error("Please upload an image first.");
    const blob = await canvasToBlob(canvasRef.current!, "image/png");
    download(blob, "profile-picture.png");
  };

  return (
    <div className="space-y-5">
      <UploadBox accept="image/*" file={file} onFileChange={setFile} />
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">Shape</label>
          <div className="flex gap-2">
            {(["circle", "square"] as const).map((s) => (
              <button key={s} onClick={() => setShape(s)} className={"flex-1 rounded-md border px-3 py-2 text-sm capitalize " + (shape === s ? "border-primary bg-primary-soft text-primary" : "border-border-muted bg-surface text-text-secondary")}>{s}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">Background</label>
          <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-full cursor-pointer rounded-md border border-border-muted bg-surface" />
        </div>
        <div>
          <label className="mb-1 flex justify-between text-xs font-medium text-text-secondary">Border <span className="text-text-muted">{border}px</span></label>
          <input type="range" min={0} max={60} value={border} onChange={(e) => setBorder(Number(e.target.value))} className="mt-3 w-full accent-[#7C3AED]" />
        </div>
      </div>
      <div className="grid place-items-center rounded-md border border-border-muted bg-surface p-6">
        <canvas ref={canvasRef} className="max-h-72 max-w-full" />
      </div>
      <button onClick={onDownload} disabled={!file} className="w-full rounded-md bg-primary py-2.5 font-heading text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-50">Download PNG</button>
    </div>
  );
}
