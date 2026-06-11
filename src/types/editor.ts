export type CardSize = {
  width: number;
  height: number;
};

export type OutputMode = "physical" | "image";
export type TemplateId = "bilibili-dynamic" | "blank";
export type PhysicalPreset = "65x95" | "85x130" | "100x150" | "custom";
export type ImagePreset = "3:4" | "2:3" | "9:16" | "4:5" | "custom";

export type OutputSettings = {
  mode: OutputMode;
  physicalPreset: PhysicalPreset;
  widthMm: number;
  heightMm: number;
  dpi: number;
  bleedMm: number;
  showBleedGuide: boolean;
  imagePreset: ImagePreset;
  widthPx: number;
  heightPx: number;
};

export type PreviewSettings = {
  backgroundColor: string;
  showTransparencyGrid: boolean;
};

export const DYNAMIC_CONTENT_LAYER_ID = "__dynamic-content__";

export type AvatarBadgeStyle = "gold" | "blue";

export type ContentAssetKey = "avatarUrl" | "avatarDecorationUrl" | "badgeImageUrl" | "logoUrl";

export type ImageLayer = {
  type: "image";
  id: string;
  name: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  flipX: boolean;
  flipY: boolean;
  rotation: number;
  opacity: number;
  visible: boolean;
};

export type TextLayer = {
  type: "text";
  id: string;
  name: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: "normal" | "italic";
  letterSpacing: number;
  lineHeight: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  shadowEnabled: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowOpacity: number;
  textDecoration: "none" | "underline";
  align: "left" | "center" | "right";
};

export const defaultTextLayerProps: Omit<
  TextLayer,
  "id" | "name" | "text" | "type" | "x" | "y" | "width" | "height"
> = {
  align: "center",
  color: "#18191c",
  fontFamily: "Arial",
  fontSize: 24,
  fontStyle: "normal",
  fontWeight: 400,
  letterSpacing: 0,
  lineHeight: 1.2,
  opacity: 1,
  rotation: 0,
  shadowBlur: 4,
  shadowColor: "#000000",
  shadowEnabled: false,
  shadowOffsetX: 1,
  shadowOffsetY: 1,
  shadowOpacity: 0.45,
  strokeColor: "#ffffff",
  strokeWidth: 0,
  textDecoration: "none",
  visible: true,
};

export type EditorLayer = ImageLayer | TextLayer;

export type EditorLayerUpdate = Partial<
  Omit<ImageLayer, "id" | "type"> & Omit<TextLayer, "id" | "type">
>;

export type CardContent = {
  avatarBadgeStyle: AvatarBadgeStyle;
  avatarDecorationUrl: string;
  avatarUrl: string;
  badgeFontFamily: string;
  badgeFontSize: number;
  badgeFontWeight: number;
  badgeImageHeight: number;
  badgeLetterSpacing: number;
  badgeText: string;
  badgeTextColor: string;
  badgeImageUrl: string;
  body: string;
  cardRadius: number;
  commentCount: string;
  likeCount: string;
  logoUrl: string;
  nickname: string;
  panelOpacity: number;
  timestamp: string;
  repostCount: string;
  showBilibiliBar: boolean;
  showAvatarBadge: boolean;
  showAvatarDecoration: boolean;
  showBadgeImage: boolean;
  showTopic: boolean;
  topic: string;
};
