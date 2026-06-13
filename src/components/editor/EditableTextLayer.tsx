import Konva from "konva";
import { useEffect, useRef } from "react";
import { Text, Transformer } from "react-konva";

import type { EditorLayerUpdate, TextLayer } from "../../types/editor";
import { getCssFontFamily } from "../../utils/fonts";

type EditableTextLayerProps = {
  layer: TextLayer;
  isSelected: boolean;
  onChange: (updates: EditorLayerUpdate) => void;
  onSelect: () => void;
};

export function EditableTextLayer({
  layer,
  isSelected,
  onChange,
  onSelect,
}: EditableTextLayerProps) {
  const textRef = useRef<Konva.Text>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!isSelected || !transformerRef.current || !textRef.current) {
      return;
    }

    transformerRef.current.nodes([textRef.current]);
    transformerRef.current.getLayer()?.batchDraw();
  }, [isSelected]);

  return (
    <>
      <Text
        align={layer.align}
        draggable
        fill={layer.color}
        fontFamily={getCssFontFamily(layer.fontFamily)}
        fontSize={layer.fontSize}
        fontStyle={
          `${layer.fontWeight >= 700 ? "bold" : ""} ${layer.fontStyle === "italic" ? "italic" : ""}`.trim() ||
          "normal"
        }
        height={layer.height}
        letterSpacing={layer.letterSpacing}
        lineHeight={layer.lineHeight}
        listening={layer.visible}
        name={layer.name}
        opacity={layer.opacity}
        ref={textRef}
        rotation={layer.rotation}
        shadowBlur={layer.shadowBlur}
        shadowColor={layer.shadowColor}
        shadowEnabled={layer.shadowEnabled}
        shadowOffsetX={layer.shadowOffsetX}
        shadowOffsetY={layer.shadowOffsetY}
        shadowOpacity={layer.shadowOpacity}
        stroke={layer.strokeColor}
        strokeWidth={layer.strokeWidth}
        text={layer.text}
        verticalAlign="middle"
        visible={layer.visible}
        width={layer.width}
        x={layer.x}
        y={layer.y}
        onClick={onSelect}
        onDragEnd={(event) => {
          onChange({
            x: Math.round(event.target.x()),
            y: Math.round(event.target.y()),
          });
        }}
        onTap={onSelect}
        onTransformEnd={() => {
          const node = textRef.current;

          if (!node) {
            return;
          }

          const scaleX = Math.abs(node.scaleX());
          const scaleY = Math.abs(node.scaleY());
          const nextWidth = Math.max(40, Math.round(node.width() * scaleX));
          const nextHeight = Math.max(24, Math.round(node.height() * scaleY));

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            height: nextHeight,
            rotation: Math.round(node.rotation()),
            width: nextWidth,
            x: Math.round(node.x()),
            y: Math.round(node.y()),
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
          flipEnabled={false}
          keepRatio={false}
          boundBoxFunc={(previousBox, nextBox) =>
            nextBox.width < 40 || nextBox.height < 24 ? previousBox : nextBox
          }
          ref={transformerRef}
          rotateAnchorOffset={28}
        />
      ) : null}
    </>
  );
}
