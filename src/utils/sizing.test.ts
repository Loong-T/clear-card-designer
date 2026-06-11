import { describe, expect, it } from "vitest";
import {
  mmToPx,
  getExportSize,
  getPreviewCardSize,
  getPreviewBleedInset,
  getOutputDescription,
  previewCardWidth,
} from "./sizing";
import type { OutputSettings } from "../types/editor";

describe("mmToPx", () => {
  it("converts mm to pixels at 300 DPI", () => {
    expect(mmToPx(25.4, 300)).toBe(300);
  });

  it("rounds to nearest integer", () => {
    expect(mmToPx(1, 300)).toBe(12);
    expect(mmToPx(10, 300)).toBe(118);
  });
});

describe("getExportSize", () => {
  it("returns pixel dimensions in image mode", () => {
    const settings: OutputSettings = {
      mode: "image",
      widthPx: 800,
      heightPx: 600,
    } as OutputSettings;
    expect(getExportSize(settings)).toEqual({ width: 800, height: 600 });
  });

  it("converts mm to px in physical mode", () => {
    const settings: OutputSettings = {
      mode: "physical",
      widthMm: 85,
      heightMm: 54,
      dpi: 300,
    } as OutputSettings;
    expect(getExportSize(settings)).toEqual({
      width: mmToPx(85, 300),
      height: mmToPx(54, 300),
    });
  });

  it("ensures minimum 1px dimension", () => {
    const settings: OutputSettings = {
      mode: "image",
      widthPx: 0,
      heightPx: 0,
    } as OutputSettings;
    expect(getExportSize(settings)).toEqual({ width: 1, height: 1 });
  });
});

describe("getPreviewCardSize", () => {
  it("maintains aspect ratio with fixed preview width", () => {
    const result = getPreviewCardSize({ width: 1000, height: 500 });
    expect(result.width).toBe(previewCardWidth);
    expect(result.height).toBe(215);
  });
});

describe("getPreviewBleedInset", () => {
  it("returns null in image mode", () => {
    const settings: OutputSettings = {
      mode: "image",
      showBleedGuide: true,
      bleedMm: 3,
      dpi: 300,
    } as OutputSettings;
    expect(
      getPreviewBleedInset(settings, { width: 800, height: 600 }, { width: 430, height: 300 }),
    ).toBeNull();
  });

  it("returns null when bleed guide is hidden", () => {
    const settings: OutputSettings = {
      mode: "physical",
      showBleedGuide: false,
      bleedMm: 3,
      dpi: 300,
    } as OutputSettings;
    expect(
      getPreviewBleedInset(settings, { width: 800, height: 600 }, { width: 430, height: 300 }),
    ).toBeNull();
  });

  it("returns null when bleed is 0", () => {
    const settings: OutputSettings = {
      mode: "physical",
      showBleedGuide: true,
      bleedMm: 0,
      dpi: 300,
    } as OutputSettings;
    expect(
      getPreviewBleedInset(settings, { width: 800, height: 600 }, { width: 430, height: 300 }),
    ).toBeNull();
  });

  it("calculates bleed inset in preview pixels", () => {
    const settings: OutputSettings = {
      mode: "physical",
      showBleedGuide: true,
      bleedMm: 3,
      dpi: 300,
      widthMm: 85,
      heightMm: 54,
    } as OutputSettings;
    const exportSize = { width: 1004, height: 638 };
    const cardSize = { width: 430, height: 273 };
    const result = getPreviewBleedInset(settings, exportSize, cardSize);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(Math.floor(Math.min(cardSize.width, cardSize.height) / 2) - 1);
  });
});

describe("getOutputDescription", () => {
  it("returns image mode description", () => {
    const settings: OutputSettings = {
      mode: "image",
      widthPx: 800,
      heightPx: 600,
    } as OutputSettings;
    expect(getOutputDescription(settings, { width: 800, height: 600 })).toBe(
      "普通图片 · 800 x 600 像素",
    );
  });

  it("returns physical mode description with bleed guide", () => {
    const settings: OutputSettings = {
      mode: "physical",
      widthMm: 85,
      heightMm: 54,
      dpi: 300,
      showBleedGuide: true,
      bleedMm: 3,
    } as OutputSettings;
    const desc = getOutputDescription(settings, { width: 1004, height: 638 });
    expect(desc).toContain("实物透卡");
    expect(desc).toContain("85 x 54 mm");
    expect(desc).toContain("300 DPI");
    expect(desc).toContain("出血参考线 3mm");
  });

  it("returns physical mode description without bleed guide", () => {
    const settings: OutputSettings = {
      mode: "physical",
      widthMm: 85,
      heightMm: 54,
      dpi: 300,
      showBleedGuide: false,
      bleedMm: 3,
    } as OutputSettings;
    const desc = getOutputDescription(settings, { width: 1004, height: 638 });
    expect(desc).toContain("未显示出血参考线");
  });
});
