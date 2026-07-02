import { useState } from "react";
import QRCode from "qrcode";
import { Copy, Download, ScanSearch } from "lucide-react";
import { toast } from "sonner";
import { downloadDataUrl } from "@/lib/download";

export function ClipboardTextQRGeneratorTool() {
  const [text, setText] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [svg, setSvg] = useState<string | null>(null);

  const onGenerate = async () => {
    const value = text.trim();
    if (!value) {
      toast.error("Paste some text first.");
      return;
    }

    try {
      const png = await QRCode.toDataURL(value, {
        width: 512,
        margin: 1,
        color: { dark: "#0F1422", light: "#FFFFFF" },
      });
      const svgStr = await QRCode.toString(value, {
        type: "svg",
        margin: 1,
        color: { dark: "#0F1422", light: "#FFFFFF" },
      });

      setGeneratedText(value);
      setDataUrl(png);
      setSvg(svgStr);
    } catch {
      toast.error("Could not generate the QR code.");
    }
  };

  const copyText = async () => {
    if (!generatedText) return;
    try {
      await navigator.clipboard.writeText(generatedText);
      toast.success("Text copied to clipboard.");
    } catch {
      toast.error("Could not copy the text.");
    }
  };

  const downloadSvg = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clipboard-text-qr.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-3 rounded-lg border border-border-muted bg-surface p-3 sm:p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">Text</p>
          <h2 className="mt-1 font-heading text-base font-semibold text-text-primary">
            Paste text and generate a QR
          </h2>
        </div>

        <div className="space-y-1.5">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Paste text here..."
            rows={6}
            className="w-full rounded-md border border-border-muted bg-card px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={onGenerate}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 font-heading text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            <ScanSearch className="h-4 w-4" />
            Generate QR Code
          </button>
          <button
            onClick={copyText}
            disabled={!generatedText}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border-muted bg-card px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Copy className="h-4 w-4" />
            Copy Text
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-border-muted bg-card p-3 sm:p-4 lg:sticky lg:top-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">Preview</p>
          {generatedText && <span className="text-xs text-text-faint">Ready</span>}
        </div>

        <div className="mt-3 rounded-lg border border-border-muted bg-surface p-3">
          {dataUrl ? (
            <img
              src={dataUrl}
              alt="Clipboard text QR code"
              className="mx-auto aspect-square w-full max-w-[15rem] rounded-md bg-white p-2.5"
            />
          ) : (
            <div className="grid min-h-[15rem] place-items-center rounded-md border border-dashed border-border-muted bg-background px-4 text-center text-sm text-text-muted">
              QR preview appears here.
            </div>
          )}
        </div>

        {generatedText && (
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => downloadDataUrl(dataUrl!, "clipboard-text-qr.png")}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                <Download className="h-4 w-4" />
                Download PNG
              </button>
              <button
                onClick={downloadSvg}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-border-muted bg-card px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-2"
              >
                <Download className="h-4 w-4" />
                Download SVG
              </button>
          </div>
        )}
      </div>
    </div>
  );
}