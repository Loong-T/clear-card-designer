import { ImagePlus, X } from "lucide-react";
import { useRef } from "react";

import type { ContentAssetKey } from "../../types/editor";

export type AssetUploadControlProps = {
  assetKey: ContentAssetKey;
  hideLabel?: boolean;
  label: string;
  value: string;
  onClear: (key: ContentAssetKey) => void;
  onUpload: (key: ContentAssetKey, file: File) => void;
};

export function AssetUploadControl({
  assetKey,
  hideLabel = false,
  label,
  value,
  onClear,
  onUpload,
}: AssetUploadControlProps) {
  const inputId = `content-asset-${assetKey}`;
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      {!hideLabel ? (
        <strong className="block truncate text-[13px] leading-5 text-[#18191c]">{label}</strong>
      ) : null}
      <div className={`flex items-center gap-3 ${hideLabel ? "" : "mt-2"}`}>
        <input
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
          id={inputId}
          ref={inputRef}
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              onUpload(assetKey, file);
            }

            event.target.value = "";
          }}
        />
        <button
          aria-label={`上传${label}`}
          className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-md border border-[#dcdfe3] bg-[#f6f7f8] text-[#9499a0] hover:border-[#00aeec] hover:text-[#00aeec]"
          title={`上传${label}`}
          type="button"
          onClick={() => inputRef.current?.click()}
        >
          {value ? (
            <img alt="" className="h-full w-full object-contain" src={value} />
          ) : (
            <ImagePlus aria-hidden="true" size={20} />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <span className="block text-xs leading-5 text-[#9499a0]">
            {value ? "已使用自定义图片" : "点击左侧方框添加图片"}
          </span>
          <span className="block text-xs leading-5 text-[#c9ccd0]">
            {value ? "点击图片可重新上传" : "未设置时使用模板默认效果"}
          </span>
        </div>
        <button
          aria-label={`清除${label}`}
          className="grid size-8 shrink-0 place-items-center rounded-md border-0 bg-transparent text-[#9499a0] hover:bg-[#f6f7f8] hover:text-[#d93664] disabled:cursor-not-allowed disabled:text-[#c9ccd0]"
          disabled={!value}
          title={`清除${label}`}
          type="button"
          onClick={() => onClear(assetKey)}
        >
          <X aria-hidden="true" size={16} />
        </button>
      </div>
    </div>
  );
}
