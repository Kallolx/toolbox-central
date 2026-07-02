import { useCallback, useRef, useState, type DragEvent } from "react";
import { Upload, X, File as FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type UploadBoxProps = {
  accept?: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  label?: string;
  hint?: string;
};

export function UploadBox({
  accept = "image/*",
  file,
  onFileChange,
  label = "Drop file here or click to upload",
  hint,
}: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    onFileChange(files[0]);
  }, [onFileChange]);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  if (file) {
    return (
      <div className="flex items-center justify-between rounded-md border border-border-muted bg-surface px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary-soft text-primary">
            <FileIcon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-text-faint">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Remove file"
          onClick={() => onFileChange(null)}
          className="grid h-8 w-8 place-items-center rounded-md text-text-muted hover:bg-surface-2 hover:text-text-primary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed px-6 py-10 text-center transition-colors",
        dragOver
          ? "border-primary bg-primary-soft"
          : "border-border-muted bg-surface hover:border-border hover:bg-surface-2",
      )}
    >
      <span className="grid h-10 w-10 place-items-center rounded-md bg-primary-soft text-primary">
        <Upload className="h-5 w-5" />
      </span>
      <p className="text-sm font-medium text-text-primary">{label}</p>
      {hint && <p className="text-xs text-text-muted">{hint}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
