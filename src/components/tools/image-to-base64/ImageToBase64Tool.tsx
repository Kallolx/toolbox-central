import { useState } from "react";
import { toast } from "sonner";
import { UploadBox } from "@/components/shared/UploadBox";
import { CopyButton } from "@/components/shared/CopyButton";
import { fileToDataURL } from "@/lib/image";

export function ImageToBase64Tool() {
  const [file, setFile] = useState<File | null>(null);
  const [value, setValue] = useState("");

  const onConvert = async () => {
    if (!file) return toast.error("Please upload an image first.");
    const url = await fileToDataURL(file);
    setValue(url);
    toast.success("Converted.");
  };

  return (
    <div className="space-y-5">
      <UploadBox accept="image/*" file={file} onFileChange={(f) => { setFile(f); setValue(""); }} />
      <button onClick={onConvert} disabled={!file} className="w-full rounded-md bg-primary py-2.5 font-heading text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-50">
        Convert to Base64
      </button>
      {value && (
        <div className="space-y-2">
          <textarea
            readOnly
            value={value}
            rows={8}
            className="w-full rounded-md border border-border-muted bg-surface p-3 font-mono text-xs text-text-primary focus:border-primary focus:outline-none"
          />
          <CopyButton value={value} label="Copy Base64" />
        </div>
      )}
    </div>
  );
}
