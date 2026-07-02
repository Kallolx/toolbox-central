import { useState } from "react";
import {
  Archive,
  CheckCircle2,
  Download,
  Image as ImageIcon,
  Loader2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { ImageFileList } from "@/components/shared/ImageFileList";
import { UploadBox } from "@/components/shared/UploadBox";
import { download, downloadZip, formatBytes } from "@/lib/download";
import { buildOutputFileName } from "@/lib/file";
import { canvasToBlob, fileToDataURL, loadImage } from "@/lib/image";

type Fmt = "image/jpeg" | "image/png" | "image/webp" | "image/avif";
type Status = "queued" | "processing" | "done" | "error";
type Job = {
  id: string;
  file: File;
  previewUrl: string;
  status: Status;
  result?: { blob: Blob; url: string; name: string };
};

const options: { label: string; value: Fmt; ext: string }[] = [
  { label: "JPG", value: "image/jpeg", ext: "jpg" },
  { label: "PNG", value: "image/png", ext: "png" },
  { label: "WebP", value: "image/webp", ext: "webp" },
  { label: "AVIF", value: "image/avif", ext: "avif" },
];

export function ImageConverterTool() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [format, setFormat] = useState<Fmt>("image/webp");
  const [busy, setBusy] = useState(false);
  const completed = jobs.filter((job) => job.status === "done").length;
  const failed = jobs.filter((job) => job.status === "error").length;
  const outputs = jobs.flatMap((job) => (job.result ? [job.result] : []));
  const showPreview = jobs.length === 1;
  const selectedFormat = options.find((option) => option.value === format)!;

  const addFiles = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length === 0) return toast.error("Please choose image files.");

    setJobs((current) => [
      ...current,
      ...imageFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        status: "queued" as const,
      })),
    ]);
  };

  const removeJob = (id: string) => {
    setJobs((current) =>
      current.filter((job) => {
        if (job.id !== id) return true;
        URL.revokeObjectURL(job.previewUrl);
        if (job.result) URL.revokeObjectURL(job.result.url);
        return false;
      }),
    );
  };

  const updateJob = (id: string, updater: (job: Job) => Job) => {
    setJobs((current) => current.map((job) => (job.id === id ? updater(job) : job)));
  };

  const onConvert = async () => {
    if (jobs.length === 0) return toast.error("Please upload at least one image.");
    setBusy(true);
    const ext = options.find((option) => option.value === format)!.ext;
    let successCount = 0;

    for (const job of jobs) {
      updateJob(job.id, (item) => {
        if (item.result) URL.revokeObjectURL(item.result.url);
        return { ...item, status: "processing", result: undefined };
      });
      try {
        const dataUrl = await fileToDataURL(job.file);
        const img = await loadImage(dataUrl);
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const blob = await canvasToBlob(canvas, format, 0.92);
        const name = buildOutputFileName(job.file.name, "", ext);
        const result = { blob, url: URL.createObjectURL(blob), name };
        updateJob(job.id, (item) => {
          if (item.result) URL.revokeObjectURL(item.result.url);
          return { ...item, status: "done", result };
        });
        successCount += 1;
      } catch {
        updateJob(job.id, (item) => ({ ...item, status: "error", result: undefined }));
      }
    }

    setBusy(false);
    if (successCount === jobs.length)
      toast.success(`${successCount} image${successCount === 1 ? "" : "s"} converted.`);
    else toast.error(`${successCount} converted, ${jobs.length - successCount} failed.`);
  };

  const onDownloadZip = async () => {
    if (outputs.length === 0) return;
    await downloadZip(outputs, "toolune-converted-images.zip");
  };

  return (
    <div className="space-y-5">
      {jobs.length === 0 ? (
        <UploadBox
          accept="image/*"
          multiple
          onFilesChange={addFiles}
          label="Drop images here or click to upload"
          hint="Add as many JPG, PNG, WebP, AVIF, or GIF files as you need"
        />
      ) : (
        <ImageFileList
          files={jobs.map((job) => ({
            id: job.id,
            file: job.file,
            previewUrl: job.previewUrl,
            detail: fileDetail(job, selectedFormat.label),
          }))}
          onAddFiles={addFiles}
          onRemoveFile={removeJob}
          disabled={busy}
          action={() => (
            <span className="hidden rounded-md border border-border-muted bg-card px-3 py-2 text-xs font-medium text-text-muted sm:inline-flex">
              Convert to {selectedFormat.label}
            </span>
          )}
        />
      )}

      <div className="rounded-md border border-border-muted bg-surface p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="text-xs font-medium text-text-secondary">Output format</label>
          <span className="text-xs text-text-faint">{jobs.length || 0} in queue</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormat(option.value)}
              className={
                "rounded-md border px-3 py-2 text-sm font-medium transition-colors " +
                (format === option.value
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border-muted bg-card text-text-secondary hover:bg-surface-2")
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <button
          onClick={onConvert}
          disabled={busy || jobs.length === 0}
          className="rounded-md bg-primary py-2.5 font-heading text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          {busy
            ? "Converting queue..."
            : `Convert ${jobs.length || ""} Image${jobs.length === 1 ? "" : "s"}`}
        </button>
        <button
          onClick={onDownloadZip}
          disabled={outputs.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-border-muted bg-surface px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-2 disabled:opacity-50"
        >
          <Archive className="h-4 w-4" />
          Download ZIP
        </button>
      </div>

      {jobs.length > 0 && (
        <div className="rounded-md border border-border-muted bg-surface p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-heading text-sm font-semibold text-text-primary">Queue</p>
              <p className="text-xs text-text-faint">
                {completed} done, {failed} failed, {jobs.length - completed - failed} waiting
              </p>
            </div>
          </div>

          {showPreview ? (
            <div className="mt-4">
              {jobs.map((job) => (
                <ResultCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {jobs.map((job) => (
                <QueueRow key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function fileDetail(job: Job, formatLabel: string) {
  const sourceType = job.file.type.split("/")[1]?.toUpperCase() || "IMAGE";
  if (job.status === "processing") return `Converting to ${formatLabel}`;
  if (job.status === "error") return `${sourceType}, ${formatBytes(job.file.size)} - failed`;
  if (job.result)
    return `${sourceType}, ${formatBytes(job.file.size)} -> ${formatBytes(job.result.blob.size)}`;
  return `${sourceType}, ${formatBytes(job.file.size)}`;
}

function ResultCard({ job }: { job: Job }) {
  return (
    <div className="overflow-hidden rounded-md border border-border-muted bg-card">
      <div className="flex aspect-[4/3] items-center justify-center bg-background">
        {job.result ? (
          <img src={job.result.url} alt="" className="h-full w-full object-contain" />
        ) : (
          <StatusIcon status={job.status} />
        )}
      </div>
      <div className="flex items-center justify-between gap-3 p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-text-primary">
            {job.result?.name || job.file.name}
          </p>
          <p className="text-xs text-text-faint">
            {job.result ? formatBytes(job.result.blob.size) : formatBytes(job.file.size)}
          </p>
        </div>
        {job.result && (
          <button
            type="button"
            aria-label="Download image"
            onClick={() => download(job.result!.blob, job.result!.name)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            <Download className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function QueueRow({ job }: { job: Job }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border-muted bg-card px-3 py-2">
      <div className="flex min-w-0 items-center gap-3">
        <StatusIcon status={job.status} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-text-primary">
            {job.result?.name || job.file.name}
          </p>
          <p className="text-xs text-text-faint">
            {job.result ? formatBytes(job.result.blob.size) : formatBytes(job.file.size)}
          </p>
        </div>
      </div>
      {job.result && (
        <button
          type="button"
          onClick={() => download(job.result!.blob, job.result!.name)}
          className="inline-flex h-8 items-center gap-2 rounded-md border border-border-muted px-3 text-xs font-medium text-text-secondary hover:bg-surface-2"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </button>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: Status }) {
  const className = "h-4 w-4";
  if (status === "done") return <CheckCircle2 className={`${className} text-accent-green`} />;
  if (status === "error") return <XCircle className={`${className} text-destructive`} />;
  if (status === "processing")
    return <Loader2 className={`${className} animate-spin text-primary`} />;
  return <ImageIcon className={`${className} text-text-faint`} />;
}
