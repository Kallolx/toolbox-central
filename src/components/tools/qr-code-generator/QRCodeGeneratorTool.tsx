import { useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { downloadDataUrl } from "@/lib/download";

export function QRCodeGeneratorTool() {
  const [text, setText] = useState("");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [svg, setSvg] = useState<string | null>(null);

  const onGenerate = async () => {
    if (!text.trim()) return toast.error("Enter a text or URL.");
    try {
      const png = await QRCode.toDataURL(text, { width: 512, margin: 1, color: { dark: "#F8FAFC", light: "#0F1422" } });
      const svgStr = await QRCode.toString(text, { type: "svg", margin: 1, color: { dark: "#0F1422", light: "#FFFFFF" } });
      setDataUrl(png);
      setSvg(svgStr);
    } catch { toast.error("Could not generate QR code."); }
  };

  const downloadSvg = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "qr-code.svg";
    a.click();
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block text-xs font-medium text-text-secondary">Text or URL</label>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="https://example.com" className="h-10 w-full rounded-md border border-border-muted bg-surface px-3 text-sm text-text-primary focus:border-primary focus:outline-none" />
      </div>
      <button onClick={onGenerate} className="w-full rounded-md bg-primary py-2.5 font-heading text-sm font-medium text-primary-foreground hover:bg-primary-hover">Generate QR Code</button>
      {dataUrl && (
        <div className="rounded-md border border-border-muted bg-surface p-4">
          <img src={dataUrl} alt="QR" className="mx-auto h-56 w-56 rounded-md" />
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <button onClick={() => downloadDataUrl(dataUrl, "qr-code.png")} className="flex-1 rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover">Download PNG</button>
            <button onClick={downloadSvg} className="flex-1 rounded-md border border-border-muted bg-surface-2 py-2 text-sm font-medium hover:bg-surface">Download SVG</button>
          </div>
        </div>
      )}
    </div>
  );
}
