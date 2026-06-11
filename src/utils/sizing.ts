import type { CardSize, OutputSettings } from "../types/editor";

export const previewCardWidth = 430;

export function mmToPx(mm: number, dpi: number) {
  return Math.round((mm / 25.4) * dpi);
}

export function getExportSize(outputSettings: OutputSettings): CardSize {
  if (outputSettings.mode === "image") {
    return {
      height: Math.max(1, Math.round(outputSettings.heightPx)),
      width: Math.max(1, Math.round(outputSettings.widthPx)),
    };
  }

  return {
    height: mmToPx(outputSettings.heightMm, outputSettings.dpi),
    width: mmToPx(outputSettings.widthMm, outputSettings.dpi),
  };
}

export function getPreviewCardSize(exportSize: CardSize): CardSize {
  return {
    height: Math.round((previewCardWidth * exportSize.height) / exportSize.width),
    width: previewCardWidth,
  };
}

export function getPreviewBleedInset(
  outputSettings: OutputSettings,
  exportSize: CardSize,
  cardSize: CardSize,
) {
  if (
    outputSettings.mode !== "physical" ||
    !outputSettings.showBleedGuide ||
    outputSettings.bleedMm <= 0
  ) {
    return null;
  }

  const bleedPx = mmToPx(outputSettings.bleedMm, outputSettings.dpi);
  const previewInset = Math.round((bleedPx / exportSize.width) * cardSize.width);
  const maxInset = Math.floor(Math.min(cardSize.width, cardSize.height) / 2) - 1;

  return Math.min(Math.max(1, previewInset), maxInset);
}

export function getOutputDescription(outputSettings: OutputSettings, exportSize: CardSize) {
  if (outputSettings.mode === "image") {
    return `普通图片 · ${exportSize.width} x ${exportSize.height} 像素`;
  }

  const bleedGuideText = outputSettings.showBleedGuide
    ? `出血参考线 ${outputSettings.bleedMm}mm（仅预览，不改变导出尺寸）`
    : "未显示出血参考线";

  return `实物透卡 · ${outputSettings.widthMm} x ${outputSettings.heightMm} mm · ${outputSettings.dpi} DPI · 导出 ${exportSize.width} x ${exportSize.height} 像素 · ${bleedGuideText}`;
}
