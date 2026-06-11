import { ImagePlus, RotateCcw, Type } from "lucide-react";
import githubIcon from "../assets/icons/github.svg";
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { CardPreview } from "../components/card/CardPreview";
import { InspectorPanel } from "../components/editor/InspectorPanel";
import { LeftSidebar } from "../components/editor/LeftSidebar";
import {
  defaultContent,
  defaultOutputSettings,
  defaultPreviewSettings,
  imagePresets,
  physicalPresets,
} from "../templates/bilibiliDynamic";
import { downloadDataUrl, exportCardElementToPng } from "../utils/exportDom";
import { loadImageSize } from "../utils/image";
import { createTextLayer } from "../utils/layerFactory";
import {
  getExportSize,
  getOutputDescription,
  getPreviewBleedInset,
  getPreviewCardSize,
} from "../utils/sizing";
import type {
  CardContent,
  ContentAssetKey,
  EditorLayer,
  EditorLayerUpdate,
  ImagePreset,
  OutputSettings,
  PhysicalPreset,
  PreviewSettings,
  TemplateId,
} from "../types/editor";
import { defaultTextLayerProps, DYNAMIC_CONTENT_LAYER_ID } from "../types/editor";

const contentAssetKeys: ContentAssetKey[] = [
  "avatarUrl",
  "avatarDecorationUrl",
  "badgeImageUrl",
  "logoUrl",
];

function revokeObjectUrl(url: string) {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

function getAssetVisibilityUpdate(key: ContentAssetKey): Partial<CardContent> {
  switch (key) {
    case "avatarDecorationUrl":
      return { showAvatarDecoration: true };
    case "badgeImageUrl":
      return { showBadgeImage: true };
    case "logoUrl":
      return { showBilibiliBar: true };
    case "avatarUrl":
      return {};
  }
}

function App() {
  const cardPreviewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState<CardContent>(defaultContent);
  const [exportStatus, setExportStatus] = useState<string>("");
  const [layers, setLayers] = useState<EditorLayer[]>([]);

  // Refs for unmount cleanup: the cleanup effect needs current values but
  // must not re-run on every state change (that would revoke then re-create URLs).
  const contentRef = useRef<CardContent>(content);
  const layersRef = useRef<EditorLayer[]>(layers);
  const [layerOrder, setLayerOrder] = useState<string[]>([DYNAMIC_CONTENT_LAYER_ID]);
  const [outputSettings, setOutputSettings] = useState<OutputSettings>(defaultOutputSettings);
  const [previewSettings, setPreviewSettings] = useState<PreviewSettings>(defaultPreviewSettings);
  const [previewZoom, setPreviewZoom] = useState(1);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState<TemplateId>("bilibili-dynamic");

  const exportSize = useMemo(() => getExportSize(outputSettings), [outputSettings]);
  const cardSize = useMemo(() => getPreviewCardSize(exportSize), [exportSize]);
  const bleedGuideInset = useMemo(
    () => getPreviewBleedInset(outputSettings, exportSize, cardSize),
    [cardSize, exportSize, outputSettings],
  );
  const outputDescription = useMemo(
    () => getOutputDescription(outputSettings, exportSize),
    [exportSize, outputSettings],
  );
  const selectedLayer = useMemo(
    () => layers.find((layer) => layer.id === selectedLayerId),
    [layers, selectedLayerId],
  );

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    layersRef.current = layers;
  }, [layers]);

  useEffect(() => {
    return () => {
      contentAssetKeys.forEach((key) => revokeObjectUrl(contentRef.current[key]));
      layersRef.current.forEach((layer) => {
        if (layer.type === "image") {
          URL.revokeObjectURL(layer.src);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (!exportStatus) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setExportStatus("");
    }, 2600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [exportStatus]);

  const updateLayer = (id: string, updates: EditorLayerUpdate) => {
    setLayers((currentLayers) =>
      currentLayers.map((layer) =>
        layer.id === id
          ? {
              ...layer,
              ...updates,
            }
          : layer,
      ),
    );
  };

  const reorderLayer = (draggedId: string, targetId: string) => {
    if (draggedId === targetId) {
      return;
    }

    setLayerOrder((currentOrder) => {
      const draggedIndex = currentOrder.indexOf(draggedId);
      const targetIndex = currentOrder.indexOf(targetId);

      if (draggedIndex < 0 || targetIndex < 0) {
        return currentOrder;
      }

      const nextOrder = [...currentOrder];
      const [draggedLayer] = nextOrder.splice(draggedIndex, 1);
      nextOrder.splice(targetIndex, 0, draggedLayer);

      return nextOrder;
    });
  };

  const removeLayer = (id: string) => {
    setLayers((currentLayers) => {
      const removedLayer = currentLayers.find((layer) => layer.id === id);

      if (removedLayer?.type === "image") {
        URL.revokeObjectURL(removedLayer.src);
      }

      return currentLayers.filter((layer) => layer.id !== id);
    });

    setSelectedLayerId((currentId) => (currentId === id ? null : currentId));
    setLayerOrder((currentOrder) => currentOrder.filter((layerId) => layerId !== id));
  };

  const resetLayer = (id: string) => {
    const currentLayer = layers.find((layer) => layer.id === id);

    if (!currentLayer) {
      return;
    }

    if (currentLayer.type === "image") {
      const longestSide = Math.max(currentLayer.width, currentLayer.height);
      const scale = longestSide > 0 ? Math.min(1, 280 / longestSide) : 1;
      const width = Math.max(24, Math.round(currentLayer.width * scale));
      const height = Math.max(24, Math.round(currentLayer.height * scale));

      updateLayer(id, {
        flipX: false,
        flipY: false,
        height,
        opacity: 1,
        rotation: 0,
        width,
        x: Math.round((cardSize.width - width) / 2),
        y: Math.round((cardSize.height - height) / 2),
      });
      return;
    }

    updateLayer(id, {
      ...defaultTextLayerProps,
      height: 48,
      width: 240,
      x: Math.round((cardSize.width - 240) / 2),
      y: Math.round((cardSize.height - 48) / 2),
    });
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (files.length === 0) {
      return;
    }

    const createdLayers = await Promise.all(
      files.map(async (file, index) => {
        const src = URL.createObjectURL(file);
        const naturalSize = await loadImageSize(src);
        const maxWidth = cardSize.width * 0.72;
        const maxHeight = cardSize.height * 0.58;
        const scale = Math.min(maxWidth / naturalSize.width, maxHeight / naturalSize.height, 1);
        const width = Math.max(24, Math.round(naturalSize.width * scale));
        const height = Math.max(24, Math.round(naturalSize.height * scale));
        const offset = index * 18;

        return {
          flipX: false,
          flipY: false,
          height,
          id: `${Date.now()}-${file.name}-${index}`,
          name: file.name.replace(/\.[^.]+$/, "") || `图片 ${layers.length + index + 1}`,
          opacity: 1,
          rotation: 0,
          src,
          type: "image" as const,
          visible: true,
          width,
          x: Math.round((cardSize.width - width) / 2 + offset),
          y: Math.round((cardSize.height - height) / 2 + offset),
        };
      }),
    );

    setLayers((currentLayers) => [...currentLayers, ...createdLayers]);
    setLayerOrder((currentOrder) => [...currentOrder, ...createdLayers.map((layer) => layer.id)]);
    setSelectedLayerId(createdLayers.at(-1)?.id ?? null);
    event.target.value = "";
  };

  const addTextLayer = () => {
    const layer = createTextLayer(layers.filter((item) => item.type === "text").length, cardSize);

    setLayers((currentLayers) => [...currentLayers, layer]);
    setLayerOrder((currentOrder) => [...currentOrder, layer.id]);
    setSelectedLayerId(layer.id);
  };

  const handleResetAllImages = () => {
    contentAssetKeys.forEach((key) => revokeObjectUrl(content[key]));
    layers.forEach((layer) => {
      if (layer.type === "image") {
        URL.revokeObjectURL(layer.src);
      }
    });
    setContent((currentContent) => ({
      ...currentContent,
      avatarBadgeStyle: "gold",
      avatarDecorationUrl: "",
      avatarUrl: "",
      badgeImageUrl: "",
      logoUrl: "",
    }));
    setLayers([]);
    setLayerOrder(templateId === "bilibili-dynamic" ? [DYNAMIC_CONTENT_LAYER_ID] : []);
    setSelectedLayerId(null);
  };

  const updateContent = (updates: Partial<CardContent>) => {
    setContent((currentContent) => ({
      ...currentContent,
      ...updates,
    }));
  };

  const uploadContentAsset = (key: ContentAssetKey, file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const nextUrl = URL.createObjectURL(file);

    setContent((currentContent) => {
      revokeObjectUrl(currentContent[key]);

      return {
        ...currentContent,
        ...getAssetVisibilityUpdate(key),
        [key]: nextUrl,
      };
    });
  };

  const clearContentAsset = (key: ContentAssetKey) => {
    setContent((currentContent) => {
      revokeObjectUrl(currentContent[key]);

      return {
        ...currentContent,
        [key]: "",
      };
    });
  };

  const updateOutputSettings = (updates: Partial<OutputSettings>) => {
    setOutputSettings((currentSettings) => ({
      ...currentSettings,
      ...updates,
    }));
  };

  const updatePreviewSettings = (updates: Partial<PreviewSettings>) => {
    setPreviewSettings((currentSettings) => ({
      ...currentSettings,
      ...updates,
    }));
  };

  const applyPhysicalPreset = (preset: PhysicalPreset) => {
    if (preset === "custom") {
      updateOutputSettings({ physicalPreset: preset });
      return;
    }

    updateOutputSettings({
      ...physicalPresets[preset],
      physicalPreset: preset,
    });
  };

  const applyImagePreset = (preset: ImagePreset) => {
    if (preset === "custom") {
      updateOutputSettings({ imagePreset: preset });
      return;
    }

    updateOutputSettings({
      ...imagePresets[preset],
      imagePreset: preset,
    });
  };

  const updatePreviewZoom = (nextZoom: number) => {
    setPreviewZoom(Math.min(2, Math.max(0.5, Number(nextZoom.toFixed(2)))));
  };

  const selectTemplate = (nextTemplateId: TemplateId) => {
    setTemplateId(nextTemplateId);
    setSelectedLayerId(null);
    setLayerOrder((currentOrder) => {
      const userLayerOrder = currentOrder.filter((id) => id !== DYNAMIC_CONTENT_LAYER_ID);

      return nextTemplateId === "bilibili-dynamic"
        ? [DYNAMIC_CONTENT_LAYER_ID, ...userLayerOrder]
        : userLayerOrder;
    });
  };

  const exportCard = async () => {
    const cardPreview = cardPreviewRef.current;

    if (!cardPreview) {
      setExportStatus("导出失败，找不到卡片预览");
      return;
    }

    flushSync(() => {
      setSelectedLayerId(null);
    });
    setExportStatus("正在导出成品图片...");

    try {
      await new Promise((resolve) => window.requestAnimationFrame(resolve));
      await new Promise((resolve) => window.requestAnimationFrame(resolve));
      const dataUrl = await exportCardElementToPng(cardPreview, {
        cardSize,
        exportSize,
      });
      downloadDataUrl(
        dataUrl,
        `clear-card-designer-transparent-${exportSize.width}x${exportSize.height}.png`,
      );
      setExportStatus("成品图片已导出");
    } catch (error) {
      console.error(error);
      setExportStatus("导出失败，请重试或检查上传图片");
    }
  };

  return (
    <main className="app-shell">
      {exportStatus ? (
        <div
          className="fixed top-[18px] right-[18px] z-20 max-w-[320px] rounded-lg border border-[#d7f1fb] bg-[rgba(241,251,255,0.96)] px-3.5 py-3 text-[13px] font-extrabold leading-[1.4] text-[#007aa6] shadow-[0_12px_30px_rgba(24,25,28,0.16)]"
          role="status"
        >
          {exportStatus}
        </div>
      ) : null}
      <header className="flex items-center justify-between gap-6 border-b border-(--border) bg-white px-6 py-[18px]">
        <div className="flex items-baseline gap-2">
          <h1 className="text-sm font-bold uppercase text-[#7b8a97]">透卡生成器</h1>
          <span className="text-xs text-[#9ca3af]">v0.1.0</span>
          <a
            href="https://github.com/Loong-T/clear-card-designer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#7b8a97] hover:text-[#4b5563] transition-colors flex items-end"
          >
            <img
              alt="GitHub"
              className="h-3 w-3 object-contain opacity-50"
              src={githubIcon}
            />
          </a>
        </div>
        <nav className="flex gap-2" aria-label="编辑工具">
          <input
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            multiple
            ref={fileInputRef}
            type="file"
            onChange={handleImageUpload}
          />
          <button
            className="tool-button"
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus aria-hidden="true" size={18} />
            <span>导入图片</span>
          </button>
          <button className="tool-button" type="button" onClick={addTextLayer}>
            <Type aria-hidden="true" size={18} />
            <span>添加文字</span>
          </button>
          <button className="tool-button" type="button" onClick={handleResetAllImages}>
            <RotateCcw aria-hidden="true" size={18} />
            <span>重置</span>
          </button>
        </nav>
      </header>

      <section className="editor-layout" aria-label="透卡编辑器">
        <LeftSidebar
          content={content}
          layers={layers}
          layerOrder={layerOrder}
          outputDescription={outputDescription}
          outputSettings={outputSettings}
          previewSettings={previewSettings}
          selectedLayerId={selectedLayerId}
          templateId={templateId}
          onApplyImagePreset={applyImagePreset}
          onApplyPhysicalPreset={applyPhysicalPreset}
          onExport={exportCard}
          onRenameLayer={(id, name) => updateLayer(id, { name })}
          onReorderLayer={reorderLayer}
          onSelectLayer={setSelectedLayerId}
          onSelectTemplate={selectTemplate}
          onUpdateContent={updateContent}
          onUpdateLayer={updateLayer}
          onUpdateOutputSettings={updateOutputSettings}
          onUpdatePreviewSettings={updatePreviewSettings}
        />

        <CardPreview
          bleedGuideInset={bleedGuideInset}
          cardPreviewRef={cardPreviewRef}
          cardSize={cardSize}
          content={content}
          layers={layers}
          layerOrder={layerOrder}
          previewSettings={previewSettings}
          previewZoom={previewZoom}
          selectedLayerId={selectedLayerId}
          templateId={templateId}
          onSelectLayer={setSelectedLayerId}
          onUpdateLayer={updateLayer}
          onZoomIn={() => updatePreviewZoom(previewZoom + 0.1)}
          onZoomOut={() => updatePreviewZoom(previewZoom - 0.1)}
          onZoomReset={() => updatePreviewZoom(1)}
        />

        <InspectorPanel
          content={content}
          selectedLayer={selectedLayer}
          templateId={templateId}
          onRemoveLayer={removeLayer}
          onResetLayer={resetLayer}
          onClearContentAsset={clearContentAsset}
          onUpdateContent={updateContent}
          onUploadContentAsset={uploadContentAsset}
          onUpdateLayer={updateLayer}
        />
      </section>
    </main>
  );
}

export default App;
