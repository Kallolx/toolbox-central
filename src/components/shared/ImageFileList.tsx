import { Plus, X } from "lucide-react";
import { useRef, type ChangeEvent, type ReactNode } from "react";
import { formatBytes } from "@/lib/download";

type ImageFileListProps = {
  files: {
    id: string;
    file: File;
    previewUrl: string;
    detail?: string;
  }[];
  accept?: string;
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (id: string) => void;
  disabled?: boolean;
  action?: (fileId: string) => ReactNode;
};

export function ImageFileList({
  files,
  accept = "image/*",
  onAddFiles,
  onRemoveFile,
  disabled = false,
  action,
}: ImageFileListProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    if (selected.length > 0) onAddFiles(selected);
    event.currentTarget.value = "";
  };

  return (
    <div className="overflow-hidden rounded-md border border-border-muted bg-surface">
      <div className="divide-y divide-border-muted">
        {files.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2.5"
          >
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border border-border-muted bg-background">
              <img src={item.previewUrl} alt="" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">{item.file.name}</p>
              <p className="mt-0.5 truncate text-xs text-text-faint">
                {item.detail || fileSummary(item.file)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {action?.(item.id)}
              <button
                type="button"
                aria-label={`Remove ${item.file.name}`}
                onClick={() => onRemoveFile(item.id)}
                disabled={disabled}
                className="grid h-9 w-9 place-items-center rounded-md text-text-muted hover:bg-card hover:text-text-primary disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border-muted px-3 py-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border-muted bg-card px-4 text-sm font-medium text-text-secondary hover:bg-surface-2 hover:text-text-primary disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add more
        </button>
        <p className="text-xs text-text-faint">
          {files.length} file{files.length === 1 ? "" : "s"} selected
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

function fileSummary(file: File) {
  const type = file.type.split("/")[1]?.toUpperCase() || "IMAGE";
  return `${type}, ${formatBytes(file.size)}`;
}
