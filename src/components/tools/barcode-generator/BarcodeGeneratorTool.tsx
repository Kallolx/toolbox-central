import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import { toast } from "sonner";
import { download } from "@/lib/download";

const formats = ["CODE128", "EAN13", "UPC"];

export function BarcodeGeneratorTool() {
  const [text, setText] = useState("123456789012");
  const [format, setFormat] = useState("CODE128");
  const svgRef = useRef<SVGSVGElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;
    try {
      JsBarcode(svgRef.current, text, {
        format,
        background: "#0F1422",
        lineColor: "#F8FAFC",
        width: 2,
        height: 90,
        margin: 12,
      });
      setReady(true);
    } catch {
      setReady(false);
    }
  }, [text, format]);

  const dl = (type: "png" | "svg") => {
    if (!ready || !svgRef.current) return toast.error("Invalid input for this format.");
    const svgStr = new XMLSerializer().serializeToString(svgRef.current);
    if (type === "svg") {
      download(new Blob([svgStr], { type: "image/svg+xml" }), "barcode.svg");
      return;
    }
    const img = new Image();
    const svgBlob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((b) => b && download(b, "barcode.png"));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">Value</label>
          <input value={text} onChange={(e) => setText(e.target.value)} className="h-10 w-full rounded-md border border-border-muted bg-surface px-3 text-sm text-text-primary focus:border-primary focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-secondary">Format</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)} className="h-10 w-full rounded-md border border-border-muted bg-surface px-3 text-sm text-text-primary focus:border-primary focus:outline-none">
            {formats.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>
      <div className="rounded-md border border-border-muted bg-surface p-4">
        <svg ref={svgRef} className="mx-auto max-w-full" />
        {!ready && <p className="text-center text-xs text-text-muted">Invalid value for this format.</p>}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button onClick={() => dl("png")} className="flex-1 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover">Download PNG</button>
        <button onClick={() => dl("svg")} className="flex-1 rounded-md border border-border-muted bg-surface-2 py-2.5 text-sm font-medium hover:bg-surface">Download SVG</button>
      </div>
    </div>
  );
}
