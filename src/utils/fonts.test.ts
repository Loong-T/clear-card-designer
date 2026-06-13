import { describe, expect, it } from "vitest";

import {
  genericFontOptions,
  getCssFontFamily,
  getFontOptions,
  sortLocalFontFamilies,
} from "./fonts";

describe("font options", () => {
  it("only exposes selectable generic families before local fonts are loaded", () => {
    expect(getFontOptions([])).toEqual(genericFontOptions);
    expect(getFontOptions([]).some(({ value }) => value === "")).toBe(false);
  });

  it("adds detected local font families after generic options", () => {
    expect(getFontOptions(["Microsoft YaHei"]).at(-1)).toEqual({
      label: "Microsoft YaHei",
      value: "Microsoft YaHei",
    });
  });

  it("sorts preferred detected families before other local fonts", () => {
    const fonts = [
      { family: "Zed", fullName: "", postscriptName: "", style: "" },
      { family: "Arial", fullName: "", postscriptName: "", style: "" },
      { family: "Alpha", fullName: "", postscriptName: "", style: "" },
    ];

    expect(sortLocalFontFamilies(fonts)).toEqual(["Arial", "Alpha", "Zed"]);
  });
});

describe("getCssFontFamily", () => {
  it("uses sans-serif for automatic font selection", () => {
    expect(getCssFontFamily("")).toBe("sans-serif");
  });

  it("keeps generic family names unquoted", () => {
    expect(getCssFontFamily("serif")).toBe("serif");
  });

  it("quotes detected local family names and includes a fallback", () => {
    expect(getCssFontFamily('Example "Sans"')).toBe('"Example \\"Sans\\"", sans-serif');
  });
});
