import { useState } from "react";
import { toast } from "sonner";
import { UploadBox } from "@/components/shared/UploadBox";
import { canvasToBlob, fileToDataURL, loadImage, stripExt } from "@/lib/image";
import { download, formatBytes } from "@/lib/download";

type Fmt = "image/jpeg" | "image/png" | "image/webp" | "image/avif";
const options: { label: string; value: Fmt; ext: string }[] = [
  { label: "JPG", value: "image/jpeg", ext: "jpg" },
  { label: "PNG", value: "image/png", ext: "png" },
  { label: "WebP", value: "image/webp", ext: "webp" },
  { label: "AVIF", value: "image/avif", ext: "avif" },
];

export function ImageConverterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<Fmt>("image/webp");
  const [result, setResult] = useState<{ blob: Blob; url: string; name: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const onConvert = async () => {
    if (!file) return toast.error("Please upload an image first.");
    setBusy(true);
    try {
      const dataUrl = await fileToDataURL(file);
      const img = await loadImage(dataUrl);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const blob = await canvasToBlob(canvas, format, 0.92);
      const ext = options.find((o) => o.value === format)!.ext;
      const name = `${stripExt(file.name)}.${ext}`;
      setResult({ blob, url: URL.createObjectURL(blob), name });
      toast.success("Image converted.");
    } catch {
      toast.error("Conversion failed. Try a different image or format.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <UploadBox accept="image/*" file={file} onFileChange={(f) => { setFile(f); setResult(null); }} hint="JPG, PNG, WebP, AVIF, GIF" />

      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">Output format</label>
        <div className="grid grid-cols-4 gap-2">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setFormat(o.value)}
              className={
                "rounded-md border px-3 py-2 text-sm font-medium transition-colors " +
                (format === o.value
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border-muted bg-surface text-text-secondary hover:bg-surface-2")
              }
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onConvert}
        disabled={busy || !file}
        className="w-full rounded-md bg-primary py-2.5 font-heading text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50"
      >
        {busy ? "Converting..." : "Convert Image"}
      </button>

      {result && (
        <div className="rounded-md border border-border-muted bg-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{result.name}</p>
              <p className="text-xs text-text-faint">{formatBytes(result.blob.size)}</p>
            </div>
            <button
              onClick={() => download(result.blob, result.name)}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
            >
              Download
            </button>
          </div>
          <img src={result.url} alt="Converted preview" className="mt-4 max-h-72 w-full rounded-md object-contain" />
        </div>
      )}
    </div>
  );
}
