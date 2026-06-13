import { Eye, EyeOff, GripVertical, Image, Pencil, Type } from "lucide-react";
import type { EditorLayer } from "../../types/editor";
import { DYNAMIC_CONTENT_LAYER_ID } from "../../types/editor";

type LayerRowProps = {
  editingLayerId: string | null;
  editingLayerName: string;
  layer: EditorLayer;
  layerIndex: number;
  isActive: boolean;
  isDropTarget: boolean;
  onCommitName: (layer: EditorLayer) => void;
  onDragEnd: () => void;
  onDragOver: (event: React.DragEvent) => void;
  onDragStart: (event: React.DragEvent, id: string) => void;
  onDrop: (event: React.DragEvent, id: string) => void;
  onEditingNameChange: (name: string) => void;
  onKeyDown: (event: React.KeyboardEvent, layer: EditorLayer) => void;
  onSelect: (id: string) => void;
  onStartRename: (layer: EditorLayer) => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
};

export function LayerRow({
  editingLayerId,
  editingLayerName,
  layer,
  layerIndex,
  isActive,
  isDropTarget,
  onCommitName,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
  onEditingNameChange,
  onKeyDown,
  onSelect,
  onStartRename,
  onToggleVisibility,
}: LayerRowProps) {
  const { id } = layer;
  const isEditing = editingLayerId === id;
  const isDynamicContent = id === DYNAMIC_CONTENT_LAYER_ID;

  return (
    <div
      className={`flex w-full min-w-0 items-center justify-between gap-2.5 mt-2.5 px-3 py-2.5 border rounded-md text-sm text-left transition-colors ${
        isActive
          ? "text-(--accent) border-[#8eddf7] bg-[#f1fbff]"
          : "border-(--border) bg-(--surface) text-(--font-secondary)"
      } ${isDropTarget ? "border-(--accent) shadow-[inset_0_0_0_1px_var(--accent)]" : ""}`}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(event) => onDrop(event, id)}
    >
      <span
        className="flex-none text-(--font-muted) cursor-grab active:cursor-grabbing"
        draggable
        onDragStart={(event) => onDragStart(event, id)}
      >
        <GripVertical aria-hidden="true" size={16} />
      </span>
      {isDynamicContent ? (
        <span className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden p-0 border-0 text-inherit bg-transparent text-left">
          <span>动态信息</span>
        </span>
      ) : isEditing ? (
        <input
          autoFocus
          className="w-0 min-w-0 h-[26px] flex-1 px-1.5 border border-(--accent) rounded text-(--font-primary) bg-white font-inherit outline-none"
          value={editingLayerName}
          onBlur={() => onCommitName(layer)}
          onChange={(event) => onEditingNameChange(event.target.value)}
          onKeyDown={(event) => onKeyDown(event, layer)}
        />
      ) : (
        <button
          className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden p-0 border-0 text-inherit bg-transparent text-left"
          title={layer.name}
          type="button"
          onDoubleClick={() => onStartRename(layer)}
          onClick={() => onSelect(id)}
        >
          {layer.type === "image" ? (
            <Image aria-hidden="true" className="shrink-0" size={13} />
          ) : (
            <Type aria-hidden="true" className="shrink-0" size={13} />
          )}
          <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
            {layer.name}
          </span>
        </button>
      )}
      {!isEditing && !isDynamicContent ? (
        <button
          aria-label={layer.visible ? `隐藏图层 ${layer.name}` : `显示图层 ${layer.name}`}
          className="grid w-6 h-6 flex-none place-items-center p-0 border-0 rounded text-(--font-muted) bg-transparent hover:text-(--accent) hover:bg-white"
          title={layer.visible ? "隐藏图层" : "显示图层"}
          type="button"
          onClick={() => onToggleVisibility(layer.id, !layer.visible)}
        >
          {layer.visible ? (
            <Eye aria-hidden="true" size={14} />
          ) : (
            <EyeOff aria-hidden="true" size={14} />
          )}
        </button>
      ) : null}
      {!isEditing && !isDynamicContent ? (
        <button
          aria-label={`重命名图层 ${layer.name}`}
          className="grid w-6 h-6 flex-none place-items-center p-0 border-0 rounded text-(--font-muted) bg-transparent hover:text-(--accent) hover:bg-white"
          title="重命名图层"
          type="button"
          onClick={() => onStartRename(layer)}
        >
          <Pencil aria-hidden="true" size={13} />
        </button>
      ) : null}
      <small className="flex-none text-(--font-muted) text-xs">层级 {layerIndex + 1}</small>
    </div>
  );
}
