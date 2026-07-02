import { saveAs } from "file-saver";
import JSZip from "jszip";
import { sanitizeFileName } from "./file";

export function download(blob: Blob, filename: string) {
  saveAs(blob, sanitizeFileName(filename));
}

export async function downloadZip(files: { blob: Blob; name: string }[], filename: string) {
  const zip = new JSZip();
  const usedNames = new Set<string>();

  files.forEach((file) => {
    const name = uniqueName(file.name, usedNames);
    zip.file(name, file.blob);
  });

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, sanitizeFileName(filename));
}

function uniqueName(name: string, usedNames: Set<string>) {
  const safeName = sanitizeFileName(name);
  if (!usedNames.has(safeName)) {
    usedNames.add(safeName);
    return safeName;
  }

  const dot = safeName.lastIndexOf(".");
  const base = dot > 0 ? safeName.slice(0, dot) : safeName;
  const ext = dot > 0 ? safeName.slice(dot) : "";
  let counter = 2;
  let next = `${base}-${counter}${ext}`;

  while (usedNames.has(next)) {
    counter += 1;
    next = `${base}-${counter}${ext}`;
  }

  usedNames.add(next);
  return next;
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
