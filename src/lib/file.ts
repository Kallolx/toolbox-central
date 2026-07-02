export function sanitizeFileName(name: string): string {
  return (
    name
      .trim()
      .replace(/[<>:"/\\|?*]/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 120) || "toolune-file"
  );
}

export function getBaseName(fileName: string): string {
  const clean = sanitizeFileName(fileName);
  return clean.replace(/\.[^/.]+$/, "") || "toolune-file";
}

export function getExtension(fileName: string): string {
  const match = sanitizeFileName(fileName).match(/\.([^/.]+)$/);
  return match?.[1]?.toLowerCase() || "";
}

export function buildOutputFileName(fileName: string, suffix: string, extension?: string): string {
  const base = getBaseName(fileName);
  const ext = extension || getExtension(fileName) || "png";
  return sanitizeFileName(`${base}${suffix}.${ext.replace(/^\./, "")}`);
}
