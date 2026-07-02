import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { toast } from "sonner";
import { UploadBox } from "@/components/shared/UploadBox";
import { canvasToBlob, fileToDataURL, loadImage, stripExt } from "@/lib/image";
import { download } from "@/lib/download";

const ratios = [
  { label: "Free", value: undefined },
  { label: "Square", value: 1 },
  { label: "16:9", value: 16 / 9 },
  { label: "4:5", value: 4 / 5 },
  { label: "9:16", value: 9 / 16 },
] as const;

export function ImageCropperTool() {
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [aspect, setAspect] = useState<number | undefined>(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!file) { setSrc(null); return; }
    fileToDataURL(file).then(setSrc);
  }, [file]);

  const onComplete = useCallback((_: Area, px: Area) => setPixels(px), []);

  const onCrop = async () => {
    if (!file || !src || !pixels) return toast.error("Upload an image and select a crop area.");
    setBusy(true);
    try {
      const img = await loadImage(src);
      const canvas = document.createElement("canvas");
      canvas.width = pixels.width;
      canvas.height = pixels.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, pixels.x, pixels.y, pixels.width, pixels.height, 0, 0, pixels.width, pixels.height);
      const blob = await canvasToBlob(canvas, "image/png");
      download(blob, `${stripExt(file.name)}-cropped.png`);
      toast.success("Cropped image downloaded.");
    } catch {
      toast.error("Crop failed.");
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-5">
      <UploadBox accept="image/*" file={file} onFileChange={setFile} />
      {src && (
        <>
          <div className="relative h-80 w-full overflow-hidden rounded-md border border-border-muted bg-surface">
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onComplete}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {ratios.map((r) => (
              <button
                key={r.label}
                onClick={() => setAspect(r.value)}
                className={
                  "rounded-md border px-3 py-1.5 text-xs font-medium " +
                  (aspect === r.value
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border-muted bg-surface text-text-secondary hover:bg-surface-2")
                }
              >
                {r.label}
              </button>
            ))}
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs font-medium text-text-secondary">Zoom</label>
              <span className="text-xs text-text-muted">{zoom.toFixed(1)}x</span>
            </div>
            <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-[#7C3AED]" />
          </div>
        </>
      )}
      <button onClick={onCrop} disabled={busy || !file} className="w-full rounded-md bg-primary py-2.5 font-heading text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-50">
        {busy ? "Cropping..." : "Crop & Download"}
      </button>
    </div>
  );
}
