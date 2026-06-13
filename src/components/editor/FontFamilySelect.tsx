import { getFontOptions } from "../../utils/fonts";
import { selectClass } from "./ui";

type FontFamilySelectProps = {
  localFontFamilies: string[];
  value: string;
  onChange: (fontFamily: string) => void;
  onLoadLocalFonts: () => void;
};

export function FontFamilySelect({
  localFontFamilies,
  value,
  onChange,
  onLoadLocalFonts,
}: FontFamilySelectProps) {
  return (
    <select
      className={selectClass}
      value={value}
      onFocus={onLoadLocalFonts}
      onPointerDown={onLoadLocalFonts}
      onChange={(event) => onChange(event.target.value)}
    >
      {value ? null : (
        <option disabled hidden value="">
          — 自动 —
        </option>
      )}
      {getFontOptions(localFontFamilies).map(({ label, value: optionValue }) => (
        <option key={optionValue} value={optionValue}>
          {label}
        </option>
      ))}
    </select>
  );
}
