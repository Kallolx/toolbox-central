import { useState } from "react";
import { toast } from "sonner";
import { UploadBox } from "@/components/shared/UploadBox";
import { canvasToBlob, fileToDataURL, loadImage, stripExt } from "@/lib/image";
import { download } from "@/lib/download";

const presets = [
  { key: "ig-post", label: "Instagram Post", w: 1080, h: 1080 },
  { key: "ig-story", label: "Instagram Story", w: 1080, h: 1920 },
  { key: "fb-post", label: "Facebook Post", w: 1200, h: 630 },
  { key: "yt-thumb", label: "YouTube Thumbnail", w: 1280, h: 720 },
  { key: "li-post", label: "LinkedIn Post", w: 1200, h: 627 },
];

export function SocialImageResizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState(presets[0]);
  const [mode, setMode] = useState<"cover" | "contain">("cover");
  const [busy, setBusy] = useState(false);

  const onResize = async () => {
    if (!file) return toast.error("Please upload an image first.");
    setBusy(true);
    try {
      const src = await fileToDataURL(file);
      const img = await loadImage(src);
      const canvas = document.createElement("canvas");
      canvas.width = preset.w; canvas.height = preset.h;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, preset.w, preset.h);

      const ir = img.naturalWidth / img.naturalHeight;
      const tr = preset.w / preset.h;
      let dw: number, dh: number, dx: number, dy: number;
      if (mode === "cover" ? ir > tr : ir < tr) {
        dh = preset.h; dw = dh * ir; dx = (preset.w - dw) / 2; dy = 0;
      } else {
        dw = preset.w; dh = dw / ir; dx = 0; dy = (preset.h - dh) / 2;
      }
      if (mode === "cover") {
        // recompute so image fills; use larger scale
        if (ir > tr) { dh = preset.h; dw = dh * ir; dx = (preset.w - dw) / 2; dy = 0; }
        else { dw = preset.w; dh = dw / ir; dx = 0; dy = (preset.h - dh) / 2; }
      }
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, dx, dy, dw, dh);
      const blob = await canvasToBlob(canvas, "image/png");
      download(blob, `${stripExt(file.name)}-${preset.key}.png`);
      toast.success("Resized and downloaded.");
    } catch { toast.error("Resize failed."); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      <UploadBox accept="image/*" file={file} onFileChange={setFile} />
      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">Preset</label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {presets.map((p) => (
            <button key={p.key} onClick={() => setPreset(p)} className={"flex items-center justify-between rounded-md border px-3 py-2 text-sm " + (preset.key === p.key ? "border-primary bg-primary-soft text-primary" : "border-border-muted bg-surface text-text-secondary hover:bg-surface-2")}>
              <span>{p.label}</span><span className="text-xs text-text-faint">{p.w}×{p.h}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">Mode</label>
        <div className="flex gap-2">
          {(["cover", "contain"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={"flex-1 rounded-md border px-3 py-2 text-sm capitalize " + (mode === m ? "border-primary bg-primary-soft text-primary" : "border-border-muted bg-surface text-text-secondary")}>{m}</button>
          ))}
        </div>
      </div>
      <button onClick={onResize} disabled={busy || !file} className="w-full rounded-md bg-primary py-2.5 font-heading text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-50">
        {busy ? "Resizing..." : "Resize & Download"}
      </button>
    </div>
  );
}
