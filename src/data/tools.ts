import type { LucideIcon } from "lucide-react";
import {
  Image as ImageIcon,
  Minimize2,
  Ruler,
  Crop,
  RotateCw,
  FileCode2,
  FileImage,
  Sparkles,
  UserCircle2,
  LayoutGrid,
  Droplets,
  QrCode,
  Barcode,
  Link as LinkIcon,
  MessageCircle,
  Tag,
  Pipette,
  Palette,
  Eraser,
  CaseSensitive,
  Type,
} from "lucide-react";

export type ToolCategorySlug =
  | "image-tools"
  | "link-tools"
  | "text-tools"
  | "color-tools"
  | "utility-tools";

export type ToolCategory = {
  name: string;
  slug: ToolCategorySlug;
  description: string;
};

export const categories: ToolCategory[] = [
  { name: "Image Tools", slug: "image-tools", description: "Convert, compress, resize and edit images." },
  { name: "Link Tools", slug: "link-tools", description: "Generate QR codes, short links and campaign URLs." },
  { name: "Text Tools", slug: "text-tools", description: "Clean, convert and analyze text." },
  { name: "Color Tools", slug: "color-tools", description: "Pick and generate colors and palettes." },
  { name: "Utility Tools", slug: "utility-tools", description: "Small everyday helpers." },
];

export type Tool = {
  name: string;
  slug: string;
  href: string;
  category: ToolCategorySlug;
  categoryName: string;
  description: string;
  Icon: LucideIcon;
  status: "working" | "mock";
  popular?: boolean;
};

const t = (
  name: string,
  slug: string,
  category: ToolCategorySlug,
  description: string,
  Icon: LucideIcon,
  extra: Partial<Tool> = {},
): Tool => ({
  name,
  slug,
  href: `/tools/${slug}`,
  category,
  categoryName: categories.find((c) => c.slug === category)!.name,
  description,
  Icon,
  status: "working",
  ...extra,
});

export const tools: Tool[] = [
  // Image
  t("Image Converter", "image-converter", "image-tools", "Convert images to JPG, PNG, WebP.", ImageIcon, { popular: true }),
  t("Image Compressor", "image-compressor", "image-tools", "Reduce image file size instantly.", Minimize2, { popular: true }),
  t("Image Resizer", "image-resizer", "image-tools", "Change image width and height.", Ruler, { popular: true }),
  t("Image Cropper", "image-cropper", "image-tools", "Crop images with preset ratios.", Crop),
  t("Image Rotator", "image-rotator", "image-tools", "Rotate or flip images.", RotateCw),
  t("Image to Base64", "image-to-base64", "image-tools", "Convert images to Base64 strings.", FileCode2),
  t("Base64 to Image", "base64-to-image", "image-tools", "Turn Base64 strings back to images.", FileImage),
  t("Favicon Generator", "favicon-generator", "image-tools", "Generate favicon sizes from a logo.", Sparkles),
  t("Profile Picture Maker", "profile-picture-maker", "image-tools", "Create clean profile pictures.", UserCircle2),
  t("Social Image Resizer", "social-image-resizer", "image-tools", "Resize images for social media.", LayoutGrid),
  t("Watermark Tool", "watermark-tool", "image-tools", "Add a text watermark to images.", Droplets),

  // Link
  t("QR Code Generator", "qr-code-generator", "link-tools", "Create QR codes from text or URLs.", QrCode, { popular: true }),
  t("Barcode Generator", "barcode-generator", "link-tools", "Generate barcodes in common formats.", Barcode),
  t("URL Shortener", "url-shortener", "link-tools", "Shorten long URLs (demo).", LinkIcon, { status: "mock", popular: true }),
  t("WhatsApp Link Generator", "whatsapp-link-generator", "link-tools", "Create direct WhatsApp chat links.", MessageCircle, { popular: true }),
  t("UTM Link Builder", "utm-link-builder", "link-tools", "Build campaign tracking URLs.", Tag),

  // Color
  t("Color Picker", "color-picker", "color-tools", "Pick colors from any image.", Pipette, { popular: true }),
  t("Color Palette Generator", "color-palette-generator", "color-tools", "Generate simple color palettes.", Palette),

  // Text
  t("Text Cleaner", "text-cleaner", "text-tools", "Clean messy copied text fast.", Eraser, { popular: true }),
  t("Case Converter", "case-converter", "text-tools", "Convert text between cases.", CaseSensitive),

  // Utility
  t("Word Counter", "word-counter", "utility-tools", "Count words, characters and more.", Type),
];

export const getToolBySlug = (slug: string) => tools.find((x) => x.slug === slug);
export const getCategoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
export const getToolsByCategory = (slug: ToolCategorySlug) => tools.filter((x) => x.category === slug);
export const getRelatedTools = (slug: string, limit = 4) => {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return tools.filter((x) => x.slug !== slug && x.category === tool.category).slice(0, limit);
};
export const popularTools = tools.filter((t) => t.popular);
