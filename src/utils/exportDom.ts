import domtoimage from "dom-to-image-more";

import type { CardSize } from "../types/editor";

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export async function exportCardElementToPng(
  cardPreview: HTMLElement,
  options: {
    cardSize: CardSize;
    exportSize: CardSize;
  },
) {
  const scale = options.exportSize.width / options.cardSize.width;
  const hasBorderWidth = (element: Element, side: "top" | "right" | "bottom" | "left") => {
    const value = window.getComputedStyle(element).getPropertyValue(`border-${side}-width`);

    return Number.parseFloat(value) > 0;
  };

  await document.fonts?.ready;

  return domtoimage.toPng(cardPreview, {
    copyDefaultStyles: false,
    filter: (node) => !(node instanceof Element) || !node.classList.contains("dom-export-hidden"),
    filterStyles: (node, propertyName) => {
      if (!propertyName.startsWith("border")) {
        return true;
      }

      if (propertyName === "border-style" || propertyName === "border-color") {
        return ["top", "right", "bottom", "left"].some((side) =>
          hasBorderWidth(node, side as "top" | "right" | "bottom" | "left"),
        );
      }

      if (propertyName.match(/^border-(top|right|bottom|left)-(style|color)$/)) {
        const side = propertyName.split("-")[1] as "top" | "right" | "bottom" | "left";
        return hasBorderWidth(node, side);
      }

      return true;
    },
    height: options.cardSize.height,
    scale,
    style: {
      height: `${options.cardSize.height}px`,
      overflow: "hidden",
      width: `${options.cardSize.width}px`,
    },
    width: options.cardSize.width,
  });
}
