import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UploadBox } from "@/components/shared/UploadBox";
import { download } from "@/lib/download";
import { buildOutputFileName, getExtension } from "@/lib/file";
import { canvasToBlob, fileToDataURL, loadImage } from "@/lib/image";

export function ImageResizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [w, setW] = useState<number>(800);
  const [h, setH] = useState<number>(600);
  const [ratio, setRatio] = useState<number | null>(null);
  const [lock, setLock] = useState(true);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string; name: string } | null>(null);

  useEffect(() => {
    if (!file) return;
    (async () => {
      const url = await fileToDataURL(file);
      const img = await loadImage(url);
      setW(img.naturalWidth);
      setH(img.naturalHeight);
      setRatio(img.naturalWidth / img.naturalHeight);
    })();
  }, [file]);

  const setWidth = (v: number) => {
    setW(v);
    if (lock && ratio) setH(Math.round(v / ratio));
  };
  const setHeight = (v: number) => {
    setH(v);
    if (lock && ratio) setW(Math.round(v * ratio));
  };

  const onResize = async () => {
    if (!file) return toast.error("Please upload an image first.");
    if (w < 1 || h < 1) return toast.error("Invalid dimensions.");
    setBusy(true);
    try {
      const url = await fileToDataURL(file);
      const img = await loadImage(url);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);
      const blob = await canvasToBlob(canvas, "image/png");
      setResult({
        blob,
        url: URL.createObjectURL(blob),
        name: buildOutputFileName(file.name, "-resized", getExtension(file.name) || "png"),
      });
      toast.success("Image resized.");
    } catch {
      toast.error("Resize failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <UploadBox
        accept="image/*"
        file={file}
        onFileChange={(f) => {
          setFile(f);
          setResult(null);
        }}
      />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Width (px)">
          <NumInput value={w} onChange={setWidth} />
        </Field>
        <Field label="Height (px)">
          <NumInput value={h} onChange={setHeight} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-text-secondary">
        <input
          type="checkbox"
          checked={lock}
          onChange={(e) => setLock(e.target.checked)}
          className="accent-[#7C3AED]"
        />
        Lock aspect ratio
      </label>
      <button
        onClick={onResize}
        disabled={busy || !file}
        className="w-full rounded-md bg-primary py-2.5 font-heading text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
      >
        {busy ? "Resizing..." : "Resize Image"}
      </button>
      {result && (
        <div className="rounded-md border border-border-muted bg-surface p-4">
          <img src={result.url} alt="" className="max-h-72 w-full rounded-md object-contain" />
          <button
            onClick={() => download(result.blob, result.name)}
            className="mt-3 w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
          >
            Download
          </button>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-text-secondary">{label}</label>
      {children}
    </div>
  );
}
function NumInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <input
      type="number"
      min={1}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-10 w-full rounded-md border border-border-muted bg-surface px-3 text-sm text-text-primary focus:border-primary focus:outline-none"
    />
  );
}
