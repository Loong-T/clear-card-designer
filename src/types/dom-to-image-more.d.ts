declare module "dom-to-image-more" {
  export type DomToImageOptions = {
    bgcolor?: string;
    cacheBust?: boolean;
    copyDefaultStyles?: boolean;
    filter?: (node: Node) => boolean;
    filterStyles?: (node: Element, propertyName: string) => boolean;
    height?: number;
    onclone?: (clonedNode: Node) => void | Promise<void>;
    quality?: number;
    scale?: number;
    style?: Partial<CSSStyleDeclaration>;
    width?: number;
  };

  export function toPng(node: Node, options?: DomToImageOptions): Promise<string>;
  export function toJpeg(node: Node, options?: DomToImageOptions): Promise<string>;
  export function toBlob(node: Node, options?: DomToImageOptions): Promise<Blob>;
  export function toCanvas(node: Node, options?: DomToImageOptions): Promise<HTMLCanvasElement>;
  export function toSvg(node: Node, options?: DomToImageOptions): Promise<string>;

  const domtoimage: {
    toBlob: typeof toBlob;
    toCanvas: typeof toCanvas;
    toJpeg: typeof toJpeg;
    toPng: typeof toPng;
    toSvg: typeof toSvg;
  };

  export default domtoimage;
}
