import { useEffect, useRef, useState } from "react";
import { UploadBox } from "@/components/shared/UploadBox";
import { CopyButton } from "@/components/shared/CopyButton";
import { fileToDataURL, loadImage } from "@/lib/image";

type Color = { hex: string; r: number; g: number; b: number };

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

const hex = (n: number) => n.toString(16).padStart(2, "0");

export function ColorPickerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [color, setColor] = useState<Color | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!file) return;
    (async () => {
      const src = await fileToDataURL(file);
      const img = await loadImage(src);
      const canvas = canvasRef.current!;
      const maxW = 800;
      const scale = Math.min(1, maxW / img.naturalWidth);
      canvas.width = img.naturalWidth * scale;
      canvas.height = img.naturalHeight * scale;
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    })();
  }, [file]);

  const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * c.width;
    const y = ((e.clientY - rect.top) / rect.height) * c.height;
    const [r, g, b] = c.getContext("2d")!.getImageData(x, y, 1, 1).data;
    setColor({ hex: `#${hex(r)}${hex(g)}${hex(b)}`.toUpperCase(), r, g, b });
  };

  return (
    <div className="space-y-5">
      <UploadBox accept="image/*" file={file} onFileChange={(f) => { setFile(f); setColor(null); }} />
      {file && (
        <div className="rounded-md border border-border-muted bg-surface p-3">
          <canvas ref={canvasRef} onClick={onClick} className="max-h-96 w-full cursor-crosshair rounded-md object-contain" />
          <p className="mt-2 text-center text-xs text-text-muted">Click anywhere on the image to pick a color.</p>
        </div>
      )}
      {color && (
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-md border border-border-muted bg-surface p-4">
            <div className="h-14 w-full rounded-md" style={{ background: color.hex }} />
          </div>
          <ColorRow label="HEX" value={color.hex} />
          <ColorRow label="RGB" value={`rgb(${color.r}, ${color.g}, ${color.b})`} />
          <ColorRow label="HSL" value={rgbToHsl(color.r, color.g, color.b)} />
        </div>
      )}
    </div>
  );
}

function ColorRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border-muted bg-surface p-4">
      <p className="text-xs text-text-faint">{label}</p>
      <p className="mt-1 truncate font-mono text-sm">{value}</p>
      <div className="mt-2"><CopyButton value={value} label="Copy" /></div>
    </div>
  );
}
