import { Download } from "lucide-react";
import { useState } from "react";

import type {
  CardContent,
  EditorLayer,
  EditorLayerUpdate,
  ImagePreset,
  OutputSettings,
  PhysicalPreset,
  PreviewSettings,
  TemplateId,
} from "../../types/editor";
import { defaultTextLayerProps, DYNAMIC_CONTENT_LAYER_ID } from "../../types/editor";
import { DocumentSettings } from "./DocumentSettings";
import { LayerRow } from "./LayerRow";
import { PanelSectionTitle } from "./PanelSectionTitle";
import { FormLabel, selectClass } from "./ui";

const dynamicContentLayer: EditorLayer = {
  ...defaultTextLayerProps,
  height: 0,
  id: DYNAMIC_CONTENT_LAYER_ID,
  name: "动态信息",
  text: "",
  type: "text",
  width: 0,
  x: 0,
  y: 0,
};

type LeftSidebarProps = {
  content: CardContent;
  layers: EditorLayer[];
  layerOrder: string[];
  outputDescription: string;
  outputSettings: OutputSettings;
  previewSettings: PreviewSettings;
  selectedLayerId: string | null;
  templateId: TemplateId;
  onApplyImagePreset: (preset: ImagePreset) => void;
  onApplyPhysicalPreset: (preset: PhysicalPreset) => void;
  onExport: () => void;
  onRenameLayer: (id: string, name: string) => void;
  onReorderLayer: (draggedId: string, targetId: string) => void;
  onSelectLayer: (id: string) => void;
  onSelectTemplate: (templateId: TemplateId) => void;
  onUpdateContent: (updates: Partial<CardContent>) => void;
  onUpdateLayer: (id: string, updates: EditorLayerUpdate) => void;
  onUpdateOutputSettings: (updates: Partial<OutputSettings>) => void;
  onUpdatePreviewSettings: (updates: Partial<PreviewSettings>) => void;
};

export function LeftSidebar({
  content,
  layers,
  layerOrder,
  outputDescription,
  outputSettings,
  previewSettings,
  selectedLayerId,
  templateId,
  onApplyImagePreset,
  onApplyPhysicalPreset,
  onExport,
  onRenameLayer,
  onReorderLayer,
  onSelectLayer,
  onSelectTemplate,
  onUpdateContent,
  onUpdateLayer,
  onUpdateOutputSettings,
  onUpdatePreviewSettings,
}: LeftSidebarProps) {
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);
  const [dropTargetLayerId, setDropTargetLayerId] = useState<string | null>(null);
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingLayerName, setEditingLayerName] = useState("");
  const orderedLayers = layerOrder.map((id, index) => ({
    id,
    index,
    layer:
      id === DYNAMIC_CONTENT_LAYER_ID
        ? dynamicContentLayer
        : layers.find((layer) => layer.id === id),
  }));

  const startRenamingLayer = (layer: EditorLayer) => {
    setEditingLayerId(layer.id);
    setEditingLayerName(layer.name);
  };

  const commitLayerName = (layer: EditorLayer) => {
    const nextName = editingLayerName.trim();

    if (nextName && nextName !== layer.name) {
      onRenameLayer(layer.id, nextName);
    }

    setEditingLayerId(null);
  };

  return (
    <aside
      className="flex min-h-0 flex-col overflow-hidden border-r border-(--border) bg-white"
      aria-label="模板与图层"
    >
      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-5 scrollbar-thin scrollbar-color-[#c9ccd0] scrollbar-gutter-stable">
        <div className="mt-3 first:mt-0">
          <PanelSectionTitle>模板</PanelSectionTitle>
          <FormLabel className="mt-3">
            <span className="sr-only">选择模板</span>
            <select
              aria-label="选择模板"
              className={selectClass}
              value={templateId}
              onChange={(event) => onSelectTemplate(event.target.value as TemplateId)}
            >
              <option value="bilibili-dynamic">哔哩哔哩动态</option>
              <option value="blank">空白画布</option>
            </select>
          </FormLabel>
        </div>

        <div className="mt-3 first:mt-0">
          <PanelSectionTitle>图层</PanelSectionTitle>
          {orderedLayers.every(({ layer }) => !layer) ? (
            <p className="pt-4 text-[13px] leading-relaxed text-(--font-muted)">
              还没有自定义图层，请使用顶部工具栏添加图片或文字
            </p>
          ) : null}
          {orderedLayers.reverse().map(({ id, layer, index }) =>
            layer ? (
              <LayerRow
                editingLayerId={editingLayerId}
                editingLayerName={editingLayerName}
                isActive={selectedLayerId === id}
                isDropTarget={dropTargetLayerId === id}
                key={id}
                layer={layer}
                layerIndex={index}
                onCommitName={commitLayerName}
                onDragEnd={() => {
                  setDraggedLayerId(null);
                  setDropTargetLayerId(null);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  if (draggedLayerId && draggedLayerId !== id) {
                    setDropTargetLayerId(id);
                  }
                }}
                onDragStart={(event, layerId) => {
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", layerId);
                  setDraggedLayerId(layerId);
                }}
                onDrop={(event, layerId) => {
                  event.preventDefault();
                  const sourceId = event.dataTransfer.getData("text/plain") || draggedLayerId;
                  if (sourceId) {
                    onReorderLayer(sourceId, layerId);
                  }
                  setDraggedLayerId(null);
                  setDropTargetLayerId(null);
                }}
                onEditingNameChange={setEditingLayerName}
                onKeyDown={(event, layer) => {
                  if (event.key === "Enter") {
                    commitLayerName(layer);
                  } else if (event.key === "Escape") {
                    setEditingLayerId(null);
                  }
                }}
                onSelect={onSelectLayer}
                onStartRename={startRenamingLayer}
                onToggleVisibility={(layerId, visible) => onUpdateLayer(layerId, { visible })}
              />
            ) : null,
          )}
        </div>

        <div className="mt-3 first:mt-0">
          <DocumentSettings
            content={content}
            outputSettings={outputSettings}
            previewSettings={previewSettings}
            onApplyImagePreset={onApplyImagePreset}
            onApplyPhysicalPreset={onApplyPhysicalPreset}
            onUpdateContent={onUpdateContent}
            onUpdateOutputSettings={onUpdateOutputSettings}
            onUpdatePreviewSettings={onUpdatePreviewSettings}
          />
        </div>

        <p className="my-4 rounded-md border border-[#d7f1fb] bg-[#f1fbff] p-3 text-xs font-bold leading-relaxed text-[#007aa6]">
          {outputDescription}
        </p>
      </div>

      <div className="shrink-0 border-t border-(--border) bg-white px-5 py-3.5 pb-5">
        <button
          className="inline-flex w-full min-h-[42px] items-center justify-center gap-2 rounded-md border border-(--accent) bg-(--accent) text-sm font-bold text-white hover:border-(--accent-hover) hover:bg-(--accent-hover)"
          type="button"
          onClick={onExport}
        >
          <Download aria-hidden="true" size={17} />
          导出成品图片
        </button>
      </div>
    </aside>
  );
}
