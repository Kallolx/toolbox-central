import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical } from "lucide-react";
import { UploadBox } from "@/components/shared/UploadBox";
import { canvasToBlob, fileToDataURL, loadImage, stripExt } from "@/lib/image";
import { download } from "@/lib/download";

export function ImageRotatorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  useEffect(() => {
    if (!file) return;
    fileToDataURL(file).then(setSrc);
    setRotation(0); setFlipH(false); setFlipV(false);
  }, [file]);

  const render = async (): Promise<{ blob: Blob; url: string } | null> => {
    if (!src) return null;
    const img = await loadImage(src);
    const rad = (rotation * Math.PI) / 180;
    const swap = rotation % 180 !== 0;
    const w = swap ? img.naturalHeight : img.naturalWidth;
    const h = swap ? img.naturalWidth : img.naturalHeight;
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.translate(w / 2, h / 2);
    ctx.rotate(rad);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    const blob = await canvasToBlob(canvas, "image/png");
    return { blob, url: URL.createObjectURL(blob) };
  };

  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => { if (src) render().then((r) => setPreview(r?.url ?? null)); /* eslint-disable-next-line */ }, [src, rotation, flipH, flipV]);

  const onDownload = async () => {
    if (!file) return toast.error("Please upload an image first.");
    const r = await render();
    if (r) download(r.blob, `${stripExt(file.name)}-rotated.png`);
  };

  return (
    <div className="space-y-5">
      <UploadBox accept="image/*" file={file} onFileChange={setFile} />
      {preview && (
        <div className="rounded-md border border-border-muted bg-surface p-4">
          <img src={preview} alt="" className="mx-auto max-h-72 rounded-md" />
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <ActionBtn onClick={() => setRotation((r) => (r - 90 + 360) % 360)} icon={<RotateCcw className="h-4 w-4" />}>Rotate Left</ActionBtn>
        <ActionBtn onClick={() => setRotation((r) => (r + 90) % 360)} icon={<RotateCw className="h-4 w-4" />}>Rotate Right</ActionBtn>
        <ActionBtn onClick={() => setFlipH((v) => !v)} icon={<FlipHorizontal className="h-4 w-4" />}>Flip H</ActionBtn>
        <ActionBtn onClick={() => setFlipV((v) => !v)} icon={<FlipVertical className="h-4 w-4" />}>Flip V</ActionBtn>
      </div>
      <button onClick={onDownload} disabled={!file} className="w-full rounded-md bg-primary py-2.5 font-heading text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-50">Download</button>
    </div>
  );
}

function ActionBtn({ children, icon, onClick }: { children: React.ReactNode; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border-muted bg-surface px-3 py-2 text-sm text-text-primary hover:bg-surface-2">
      {icon}{children}
    </button>
  );
}
