import { useState } from "react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { UploadBox } from "@/components/shared/UploadBox";
import { download, formatBytes } from "@/lib/download";

export function ImageCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(70);
  const [result, setResult] = useState<{ blob: Blob; url: string; name: string; before: number } | null>(null);
  const [busy, setBusy] = useState(false);

  const onCompress = async () => {
    if (!file) return toast.error("Please upload an image first.");
    setBusy(true);
    try {
      const before = file.size;
      const compressed = await imageCompression(file, {
        maxSizeMB: 10,
        maxWidthOrHeight: 4000,
        useWebWorker: true,
        initialQuality: quality / 100,
      });
      setResult({ blob: compressed, url: URL.createObjectURL(compressed), name: compressed.name || file.name, before });
      toast.success("Image compressed.");
    } catch {
      toast.error("Compression failed.");
    } finally {
      setBusy(false);
    }
  };

  const savings = result ? Math.max(0, Math.round((1 - result.blob.size / result.before) * 100)) : 0;

  return (
    <div className="space-y-5">
      <UploadBox accept="image/*" file={file} onFileChange={(f) => { setFile(f); setResult(null); }} />
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-xs font-medium text-text-secondary">Quality</label>
          <span className="text-xs text-text-muted">{quality}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={100}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className="w-full accent-[#7C3AED]"
        />
      </div>
      <button
        onClick={onCompress}
        disabled={busy || !file}
        className="w-full rounded-md bg-primary py-2.5 font-heading text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
      >
        {busy ? "Compressing..." : "Compress Image"}
      </button>
      {result && (
        <div className="rounded-md border border-border-muted bg-surface p-4">
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div><p className="text-text-faint">Before</p><p className="mt-0.5 font-heading text-sm text-text-primary">{formatBytes(result.before)}</p></div>
            <div><p className="text-text-faint">After</p><p className="mt-0.5 font-heading text-sm text-text-primary">{formatBytes(result.blob.size)}</p></div>
            <div><p className="text-text-faint">Saved</p><p className="mt-0.5 font-heading text-sm text-accent-green">{savings}%</p></div>
          </div>
          <img src={result.url} alt="" className="mt-4 max-h-64 w-full rounded-md object-contain" />
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
