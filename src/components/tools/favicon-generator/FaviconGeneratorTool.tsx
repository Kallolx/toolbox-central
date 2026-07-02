import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UploadBox } from "@/components/shared/UploadBox";
import { canvasToBlob, fileToDataURL, loadImage } from "@/lib/image";
import { download } from "@/lib/download";

const SIZES = [16, 32, 48, 180, 192];

export function FaviconGeneratorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previews, setPreviews] = useState<{ size: number; url: string; blob: Blob }[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setPreviews([]); }, [file]);

  const onGenerate = async () => {
    if (!file) return toast.error("Please upload an image first.");
    setBusy(true);
    try {
      const src = await fileToDataURL(file);
      const img = await loadImage(src);
      const out = await Promise.all(SIZES.map(async (size) => {
        const canvas = document.createElement("canvas");
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, size, size);
        const blob = await canvasToBlob(canvas, "image/png");
        return { size, url: URL.createObjectURL(blob), blob };
      }));
      setPreviews(out);
      toast.success("Favicons generated.");
    } catch { toast.error("Generation failed."); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      <UploadBox accept="image/*" file={file} onFileChange={setFile} hint="Square logo works best" />
      <button onClick={onGenerate} disabled={busy || !file} className="w-full rounded-md bg-primary py-2.5 font-heading text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-50">
        {busy ? "Generating..." : "Generate Favicons"}
      </button>
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {previews.map((p) => (
            <div key={p.size} className="rounded-md border border-border-muted bg-surface p-3 text-center">
              <div className="mx-auto grid h-16 place-items-center">
                <img src={p.url} alt="" style={{ width: Math.min(p.size, 64), height: Math.min(p.size, 64) }} />
              </div>
              <p className="mt-2 text-xs text-text-muted">{p.size}×{p.size}</p>
              <button onClick={() => download(p.blob, `favicon-${p.size}.png`)} className="mt-2 w-full rounded-md border border-border-muted bg-surface-2 py-1.5 text-xs hover:bg-surface">
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
