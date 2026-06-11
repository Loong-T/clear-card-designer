import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";

import type { EditorLayerUpdate, ImageLayer } from "../../types/editor";

type EditableImageLayerProps = {
  layer: ImageLayer;
  isSelected: boolean;
  onChange: (updates: EditorLayerUpdate) => void;
  onSelect: () => void;
};

function useLoadedImage(src: string) {
  const [image, setImage] = useState<HTMLImageElement | undefined>();

  useEffect(() => {
    const nextImage = new window.Image();
    nextImage.onload = () => setImage(nextImage);
    nextImage.src = src;

    return () => {
      nextImage.onload = null;
    };
  }, [src]);

  return image;
}

export function EditableImageLayer({
  layer,
  isSelected,
  onChange,
  onSelect,
}: EditableImageLayerProps) {
  const image = useLoadedImage(layer.src);
  const imageRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!isSelected || !transformerRef.current || !imageRef.current) {
      return;
    }

    transformerRef.current.nodes([imageRef.current]);
    transformerRef.current.getLayer()?.batchDraw();
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        draggable
        height={layer.height}
        image={image}
        listening={layer.visible}
        name={layer.name}
        offsetX={layer.width / 2}
        offsetY={layer.height / 2}
        opacity={layer.opacity}
        ref={imageRef}
        rotation={layer.rotation}
        scaleX={layer.flipX ? -1 : 1}
        scaleY={layer.flipY ? -1 : 1}
        visible={layer.visible}
        width={layer.width}
        x={layer.x + layer.width / 2}
        y={layer.y + layer.height / 2}
        onClick={onSelect}
        onDragEnd={(event) => {
          onChange({
            x: Math.round(event.target.x() - layer.width / 2),
            y: Math.round(event.target.y() - layer.height / 2),
          });
        }}
        onTap={onSelect}
        onTransformEnd={() => {
          const node = imageRef.current;

          if (!node) {
            return;
          }

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          const nextWidth = Math.max(24, Math.round(node.width() * Math.abs(scaleX)));
          const nextHeight = Math.max(24, Math.round(node.height() * Math.abs(scaleY)));

          node.scaleX(layer.flipX ? -1 : 1);
          node.scaleY(layer.flipY ? -1 : 1);

          onChange({
            height: nextHeight,
            rotation: Math.round(node.rotation()),
            width: nextWidth,
            x: Math.round(node.x() - nextWidth / 2),
            y: Math.round(node.y() - nextHeight / 2),
          });
        }}
      />
      {isSelected ? (
        <Transformer
          anchorCornerRadius={6}
          anchorFill="#ffffff"
          anchorSize={9}
          borderDash={[5, 4]}
          borderStroke="#00aeec"
          boundBoxFunc={(_, nextBox) => {
            if (nextBox.width < 24 || nextBox.height < 24) {
              return _;
            }

            return nextBox;
          }}
          ref={transformerRef}
          rotateAnchorOffset={28}
        />
      ) : null}
    </>
  );
}
