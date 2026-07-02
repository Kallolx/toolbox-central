import type { ComponentType } from "react";
import { ImageConverterTool } from "./image-converter/ImageConverterTool";
import { ImageCompressorTool } from "./image-compressor/ImageCompressorTool";
import { ImageResizerTool } from "./image-resizer/ImageResizerTool";
import { ImageCropperTool } from "./image-cropper/ImageCropperTool";
import { ImageRotatorTool } from "./image-rotator/ImageRotatorTool";
import { ImageToBase64Tool } from "./image-to-base64/ImageToBase64Tool";
import { Base64ToImageTool } from "./base64-to-image/Base64ToImageTool";
import { FaviconGeneratorTool } from "./favicon-generator/FaviconGeneratorTool";
import { ProfilePictureMakerTool } from "./profile-picture-maker/ProfilePictureMakerTool";
import { SocialImageResizerTool } from "./social-image-resizer/SocialImageResizerTool";
import { WatermarkTool } from "./watermark-tool/WatermarkTool";
import { QRCodeGeneratorTool } from "./qr-code-generator/QRCodeGeneratorTool";
import { ClipboardTextQRGeneratorTool } from "./clipboard-text-qr-generator/ClipboardTextQRGeneratorTool";
import { BarcodeGeneratorTool } from "./barcode-generator/BarcodeGeneratorTool";
import { URLShortenerTool } from "./url-shortener/URLShortenerTool";
import { WhatsAppLinkGeneratorTool } from "./whatsapp-link-generator/WhatsAppLinkGeneratorTool";
import { UTMLinkBuilderTool } from "./utm-link-builder/UTMLinkBuilderTool";
import { ColorPickerTool } from "./color-picker/ColorPickerTool";
import { ColorPaletteGeneratorTool } from "./color-palette-generator/ColorPaletteGeneratorTool";
import { TextCleanerTool } from "./text-cleaner/TextCleanerTool";
import { CaseConverterTool } from "./case-converter/CaseConverterTool";
import { WordCounterTool } from "./word-counter/WordCounterTool";

export const ToolComponents: Record<string, ComponentType> = {
  "image-converter": ImageConverterTool,
  "image-compressor": ImageCompressorTool,
  "image-resizer": ImageResizerTool,
  "bulk-image-resizer": ImageResizerTool,
  "photo-size-converter": ImageResizerTool,
  "signature-resize-tool": ImageResizerTool,
  "admit-card-photo-resizer": ImageResizerTool,
  "image-cropper": ImageCropperTool,
  "document-photo-cropper": ImageCropperTool,
  "image-rotator": ImageRotatorTool,
  "image-to-base64": ImageToBase64Tool,
  "base64-to-image": Base64ToImageTool,
  "favicon-generator": FaviconGeneratorTool,
  "profile-picture-maker": ProfilePictureMakerTool,
  "social-image-resizer": SocialImageResizerTool,
  "watermark-tool": WatermarkTool,
  "image-watermark-tool": WatermarkTool,
  "qr-code-generator": QRCodeGeneratorTool,
  "wifi-qr-generator": ClipboardTextQRGeneratorTool,
  "whatsapp-qr-generator": QRCodeGeneratorTool,
  "vcard-qr-generator": QRCodeGeneratorTool,
  "bulk-qr-generator": QRCodeGeneratorTool,
  "qr-label-sheet-maker": QRCodeGeneratorTool,
  "barcode-generator": BarcodeGeneratorTool,
  "url-shortener": URLShortenerTool,
  "whatsapp-link-generator": WhatsAppLinkGeneratorTool,
  "utm-link-builder": UTMLinkBuilderTool,
  "color-picker": ColorPickerTool,
  "color-palette-generator": ColorPaletteGeneratorTool,
  "text-cleaner": TextCleanerTool,
  "case-converter": CaseConverterTool,
  "word-counter": WordCounterTool,
};
