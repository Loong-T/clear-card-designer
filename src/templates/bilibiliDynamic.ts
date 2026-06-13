import type {
  CardContent,
  ImagePreset,
  OutputSettings,
  PhysicalPreset,
  PreviewSettings,
} from "../types/editor";

export const defaultContent: CardContent = {
  avatarBadgeStyle: "gold",
  avatarDecorationUrl: "",
  avatarUrl: "",
  badgeFontFamily: "",
  badgeFontSize: 8,
  badgeFontWeight: 700,
  badgeImageHeight: 30,
  badgeLetterSpacing: 0.5,
  badgeText: "000001",
  badgeTextColor: "#b97cb5",
  badgeImageUrl: "",
  body: "你才是憨憨",
  cardFontFamily: "",
  cardFontStyle: "normal",
  cardFontWeight: 0,
  cardLetterSpacing: 0,
  cardRadius: 0,
  cardTextShadowBlur: 4,
  cardTextShadowColor: "#000000",
  cardTextShadowEnabled: false,
  cardTextShadowOffsetX: 1,
  cardTextShadowOffsetY: 1,
  commentCount: "158",
  likeCount: "822",
  logoUrl: "",
  nickname: "星河Sagi",
  panelOpacity: 1,
  repostCount: "转发",
  showBilibiliBar: true,
  showAvatarBadge: true,
  showAvatarDecoration: true,
  showBadgeImage: true,
  showTopic: true,
  timestamp: "9:09",
  topic: "Sagi村庄布告栏",
};

export const defaultOutputSettings: OutputSettings = {
  bleedMm: 1,
  dpi: 300,
  heightMm: 130,
  heightPx: 1620,
  imagePreset: "2:3",
  mode: "physical",
  physicalPreset: "85x130",
  showBleedGuide: true,
  widthMm: 85,
  widthPx: 1080,
};

export const defaultPreviewSettings: PreviewSettings = {
  backgroundColor: "#ffffff",
  showTransparencyGrid: true,
};

export const physicalPresets: Record<
  Exclude<PhysicalPreset, "custom">,
  { heightMm: number; widthMm: number }
> = {
  "65x95": { heightMm: 95, widthMm: 65 },
  "85x130": { heightMm: 130, widthMm: 85 },
  "100x150": { heightMm: 150, widthMm: 100 },
};

export const imagePresets: Record<
  Exclude<ImagePreset, "custom">,
  { heightPx: number; widthPx: number }
> = {
  "2:3": { heightPx: 1620, widthPx: 1080 },
  "3:4": { heightPx: 1440, widthPx: 1080 },
  "4:5": { heightPx: 1350, widthPx: 1080 },
  "9:16": { heightPx: 1920, widthPx: 1080 },
};
