import { Minus, Plus, RotateCcw } from "lucide-react";
import type { CSSProperties, RefObject } from "react";
import { Layer, Stage } from "react-konva";

import { EditableImageLayer } from "../editor/EditableImageLayer";
import { EditableTextLayer } from "../editor/EditableTextLayer";
import type {
  CardContent,
  CardSize,
  EditorLayer,
  EditorLayerUpdate,
  PreviewSettings,
  TemplateId,
} from "../../types/editor";
import { DYNAMIC_CONTENT_LAYER_ID } from "../../types/editor";
import { BilibiliDynamicContent } from "./BilibiliDynamicContent";

type CardPreviewProps = {
  bleedGuideInset: number | null;
  cardPreviewRef: RefObject<HTMLDivElement | null>;
  cardSize: CardSize;
  content: CardContent;
  layers: EditorLayer[];
  layerOrder: string[];
  previewSettings: PreviewSettings;
  previewZoom: number;
  selectedLayerId: string | null;
  templateId: TemplateId;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: EditorLayerUpdate) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
};

type UserLayersProps = {
  cardSize: CardSize;
  layers: EditorLayer[];
  zIndex: number;
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: EditorLayerUpdate) => void;
};

type ZoomControlsProps = {
  previewZoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
};

const zoomDividerButtonClass =
  "grid h-9 w-9 place-items-center border-0 border-r border-[#e3e5e7] bg-transparent text-[#61666d] hover:bg-[#f6f7f8] hover:text-[#00aeec]";
const zoomEdgeButtonClass =
  "grid h-9 w-9 place-items-center border-0 bg-transparent text-[#61666d] hover:bg-[#f6f7f8] hover:text-[#00aeec] disabled:cursor-not-allowed disabled:text-[#c9ccd0]";

function UserLayers({
  cardSize,
  layers,
  zIndex,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
}: UserLayersProps) {
  return (
    <Stage
      className="absolute inset-0"
      height={cardSize.height}
      style={{ zIndex }}
      width={cardSize.width}
      onMouseDown={(event) => {
        if (event.target === event.target.getStage()) {
          onSelectLayer(null);
        }
      }}
      onTouchStart={(event) => {
        if (event.target === event.target.getStage()) {
          onSelectLayer(null);
        }
      }}
    >
      <Layer>
        {layers.map((layer) =>
          layer.type === "image" ? (
            <EditableImageLayer
              isSelected={selectedLayerId === layer.id}
              key={layer.id}
              layer={layer}
              onChange={(updates) => onUpdateLayer(layer.id, updates)}
              onSelect={() => onSelectLayer(layer.id)}
            />
          ) : (
            <EditableTextLayer
              isSelected={selectedLayerId === layer.id}
              key={layer.id}
              layer={layer}
              onChange={(updates) => onUpdateLayer(layer.id, updates)}
              onSelect={() => onSelectLayer(layer.id)}
            />
          ),
        )}
      </Layer>
    </Stage>
  );
}

function ZoomControls({ previewZoom, onZoomIn, onZoomOut, onZoomReset }: ZoomControlsProps) {
  return (
    <div
      data-preview-controls
      className="absolute right-5 bottom-5 z-20 inline-flex items-center overflow-hidden rounded-lg border border-[#dcdfe3] bg-white/95 shadow-[0_10px_24px_rgba(24,25,28,0.14)] backdrop-blur"
      aria-label="预览缩放"
    >
      <button
        aria-label="缩小预览"
        className={`${zoomDividerButtonClass} disabled:cursor-not-allowed disabled:text-[#c9ccd0]`}
        disabled={previewZoom <= 0.5}
        type="button"
        onClick={onZoomOut}
      >
        <Minus aria-hidden="true" size={17} strokeWidth={2.2} />
      </button>
      <button
        className="h-9 min-w-14 border-0 border-r border-[#e3e5e7] bg-transparent px-2 text-xs font-bold text-[#61666d] hover:bg-[#f6f7f8] hover:text-[#00aeec]"
        type="button"
        onClick={onZoomReset}
      >
        {Math.round(previewZoom * 100)}%
      </button>
      <button
        aria-label="重置预览缩放"
        className={zoomDividerButtonClass}
        type="button"
        onClick={onZoomReset}
      >
        <RotateCcw aria-hidden="true" size={15} strokeWidth={2} />
      </button>
      <button
        aria-label="放大预览"
        className={zoomEdgeButtonClass}
        disabled={previewZoom >= 2}
        type="button"
        onClick={onZoomIn}
      >
        <Plus aria-hidden="true" size={18} strokeWidth={2.2} />
      </button>
    </div>
  );
}

export function CardPreview({
  bleedGuideInset,
  cardPreviewRef,
  cardSize,
  content,
  layers,
  layerOrder,
  previewSettings,
  previewZoom,
  selectedLayerId,
  templateId,
  onSelectLayer,
  onUpdateLayer,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: CardPreviewProps) {
  const orderedLayers = layerOrder
    .map((id) => layers.find((layer) => layer.id === id))
    .filter((layer): layer is EditorLayer => Boolean(layer));
  const dynamicContentIndex = layerOrder.indexOf(DYNAMIC_CONTENT_LAYER_ID);
  const isBlankTemplate = templateId === "blank";
  const lowerLayers = isBlankTemplate ? orderedLayers : orderedLayers.slice(0, dynamicContentIndex);
  const upperLayers = isBlankTemplate ? [] : orderedLayers.slice(dynamicContentIndex);

  return (
    <section
      className={`relative grid h-full min-h-0 items-start justify-items-center overflow-auto p-4 ${
        previewSettings.showTransparencyGrid ? "show-transparent-grid" : ""
      }`}
      style={
        {
          backgroundColor: previewSettings.backgroundColor,
          "--preview-bg": previewSettings.backgroundColor,
        } as CSSProperties
      }
      aria-label="画布预览"
      onPointerDown={(event) => {
        const target = event.target;

        if (
          target instanceof Element &&
          !target.closest(".card-preview, [data-preview-controls]")
        ) {
          onSelectLayer(null);
        }
      }}
    >
      {/* --- Zoomed preview canvas --- */}
      <div
        className="grid items-start justify-items-center bg-transparent p-4"
        style={{
          height: cardSize.height * previewZoom + 32,
          width: cardSize.width * previewZoom + 32,
        }}
      >
        <div
          className="origin-top"
          style={{
            height: cardSize.height,
            transform: `scale(${previewZoom})`,
            width: cardSize.width,
          }}
        >
          {/* --- Export target card --- */}
          <div
            className="card-preview relative flex flex-col overflow-hidden bg-transparent"
            ref={cardPreviewRef}
            style={
              {
                borderRadius: content.cardRadius,
                height: cardSize.height,
                width: cardSize.width,
                "--card-height": `${cardSize.height}px`,
                "--card-width": `${cardSize.width}px`,
                "--bleed-guide-inset": `${bleedGuideInset ?? 0}px`,
                "--card-radius": `${content.cardRadius}px`,
              } as CSSProperties
            }
            aria-label={isBlankTemplate ? "空白透卡预览" : "B 站动态透卡预览"}
          >
            {/* --- User layers below structured content --- */}
            {lowerLayers.length > 0 ? (
              <UserLayers
                cardSize={cardSize}
                layers={lowerLayers}
                selectedLayerId={selectedLayerId}
                zIndex={1}
                onSelectLayer={onSelectLayer}
                onUpdateLayer={onUpdateLayer}
              />
            ) : null}

            {/* --- Bleed guide overlay --- */}
            {bleedGuideInset ? (
              <div className="bleed-guide dom-export-hidden" aria-hidden="true" />
            ) : null}

            {/* --- Structured card content --- */}
            {isBlankTemplate ? null : <BilibiliDynamicContent content={content} />}

            {/* --- User layers above structured content --- */}
            {upperLayers.length > 0 ? (
              <UserLayers
                cardSize={cardSize}
                layers={upperLayers}
                selectedLayerId={selectedLayerId}
                zIndex={4}
                onSelectLayer={onSelectLayer}
                onUpdateLayer={onUpdateLayer}
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* --- Preview zoom controls --- */}
      <ZoomControls
        previewZoom={previewZoom}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onZoomReset={onZoomReset}
      />
    </section>
  );
}
