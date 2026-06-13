import { useRef, useState } from "react";

import { sortLocalFontFamilies } from "../../utils/fonts";

export function useLocalFonts() {
  const [localFontFamilies, setLocalFontFamilies] = useState<string[]>([]);
  const [localFontStatus, setLocalFontStatus] = useState("");
  const localFontsRequestedRef = useRef(false);

  const loadLocalFonts = async () => {
    if (localFontsRequestedRef.current) {
      return;
    }

    localFontsRequestedRef.current = true;

    if (!window.queryLocalFonts) {
      setLocalFontStatus("当前浏览器不支持读取本机字体");
      return;
    }

    try {
      setLocalFontFamilies(sortLocalFontFamilies(await window.queryLocalFonts()));
      setLocalFontStatus("");
    } catch {
      localFontsRequestedRef.current = false;
      setLocalFontStatus("未获得本机字体读取权限");
    }
  };

  return {
    loadLocalFonts,
    localFontFamilies,
    localFontStatus,
  };
}
