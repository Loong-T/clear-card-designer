type LocalFontData = {
  family: string;
  fullName: string;
  postscriptName: string;
  style: string;
};

interface Window {
  queryLocalFonts?: () => Promise<LocalFontData[]>;
}
