import { useState } from "react";
import { toast } from "sonner";
import { downloadDataUrl } from "@/lib/download";

export function Base64ToImageTool() {
  const [value, setValue] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const onPreview = () => {
    const v = value.trim();
    if (!v) return toast.error("Paste a Base64 string first.");
    const src = v.startsWith("data:") ? v : `data:image/png;base64,${v}`;
    const img = new Image();
    img.onload = () => setPreview(src);
    img.onerror = () => toast.error("Invalid Base64 image data.");
    img.src = src;
  };

  return (
    <div className="space-y-5">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={6}
        placeholder="Paste Base64 or data URL..."
        className="w-full rounded-md border border-border-muted bg-surface p-3 font-mono text-xs text-text-primary placeholder:text-text-faint focus:border-primary focus:outline-none"
      />
      <button onClick={onPreview} className="w-full rounded-md bg-primary py-2.5 font-heading text-sm font-medium text-primary-foreground hover:bg-primary-hover">
        Preview Image
      </button>
      {preview && (
        <div className="rounded-md border border-border-muted bg-surface p-4">
          <img src={preview} alt="preview" className="mx-auto max-h-72 rounded-md" />
          <button onClick={() => downloadDataUrl(preview, "decoded.png")} className="mt-3 w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
            Download
          </button>
        </div>
      )}
    </div>
  );
}
