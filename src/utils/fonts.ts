export const genericFontOptions = [
  { label: "无衬线字体", value: "sans-serif" },
  { label: "衬线字体", value: "serif" },
  { label: "等宽字体", value: "monospace" },
  { label: "手写字体", value: "cursive" },
  { label: "装饰字体", value: "fantasy" },
];
const genericFontFamilies = new Set(genericFontOptions.map(({ value }) => value).filter(Boolean));

const preferredFontFamilyOrder = [
  "D-DIN",
  "Bahnschrift",
  "DIN Alternate",
  "DIN Condensed",
  "Eurostile",
  "Square 721",
  "Orbitron",
  "Arial Narrow",
  "Helvetica Neue",
  "Segoe UI",
  "Roboto",
  "Arial",
  "PingFang SC",
  "Microsoft YaHei",
  "Hiragino Sans GB",
  "Noto Sans CJK SC",
  "Noto Sans SC",
];

export function getFontOptions(localFontFamilies: string[]) {
  return [
    ...genericFontOptions,
    ...localFontFamilies.map((fontFamily) => ({ label: fontFamily, value: fontFamily })),
  ];
}

export function getCssFontFamily(fontFamily: string) {
  if (!fontFamily) {
    return "sans-serif";
  }

  if (genericFontFamilies.has(fontFamily)) {
    return fontFamily;
  }

  const escapedFontFamily = fontFamily.replaceAll("\\", "\\\\").replaceAll('"', '\\"');

  return `"${escapedFontFamily}", sans-serif`;
}

export function sortLocalFontFamilies(fonts: LocalFontData[]) {
  const availableFamilies = Array.from(
    new Set(fonts.map((font) => font.family).filter(Boolean)),
  ).sort((left, right) => left.localeCompare(right, "zh-CN"));
  const familySet = new Set(availableFamilies);
  const preferredFamilies = preferredFontFamilyOrder.filter((family) => familySet.has(family));
  const preferredFamilySet = new Set(preferredFamilies);

  return [
    ...preferredFamilies,
    ...availableFamilies.filter((family) => !preferredFamilySet.has(family)),
  ];
}
