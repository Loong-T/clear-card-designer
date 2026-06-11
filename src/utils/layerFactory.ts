import type { CardSize, EditorLayer } from "../types/editor";
import { defaultTextLayerProps } from "../types/editor";

export function createTextLayer(existingTextLayerCount: number, cardSize: CardSize): EditorLayer {
  const width = Math.min(240, cardSize.width - 48);
  const height = 48;

  return {
    ...defaultTextLayerProps,
    height,
    id: `${Date.now()}-text`,
    name: `文字 ${existingTextLayerCount + 1}`,
    text: "憨憨",
    type: "text",
    width,
    x: Math.round((cardSize.width - width) / 2),
    y: Math.round((cardSize.height - height) / 2),
  };
}
