import { FlipHorizontal, FlipVertical, RotateCcw, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import blueAvatarBadge from "../../assets/bilibili-dynamic/images/avatar-badge-blue.png";
import goldAvatarBadge from "../../assets/bilibili-dynamic/images/avatar-badge-gold.png";
import type {
  CardContent,
  ContentAssetKey,
  EditorLayer,
  EditorLayerUpdate,
  TemplateId,
} from "../../types/editor";
import { AssetUploadControl } from "./AssetUploadControl";
import { ContentSection } from "./ContentSection";
import { ContentPartTitle } from "./ContentPartTitle";
import {
  checkboxClass,
  colorInputClass,
  ControlGrid,
  dangerButtonClass,
  FormLabel,
  hintClass,
  inputClass,
  secondaryButtonClass,
  selectClass,
  textareaClass,
  ToggleRow,
} from "./ui";

const preferredFontFamilyOrder = [
  "D-DIN",
  "Bahnschrift",
  "DIN Alternate",
  "DIN Condensed",
  "Eurostile",
  "Square 721",
  "Orbitron",
  "Arial Narrow",
  "Helvetica Neue",
  "Segoe UI",
  "Roboto",
  "Arial",
  "PingFang SC",
  "Microsoft YaHei",
  "Hiragino Sans GB",
  "Noto Sans CJK SC",
  "Noto Sans SC",
];

function getFiniteValue(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

type InspectorPanelProps = {
  content: CardContent;
  selectedLayer: EditorLayer | undefined;
  templateId: TemplateId;
  onRemoveLayer: (id: string) => void;
  onResetLayer: (id: string) => void;
  onClearContentAsset: (key: ContentAssetKey) => void;
  onUpdateContent: (updates: Partial<CardContent>) => void;
  onUploadContentAsset: (key: ContentAssetKey, file: File) => void;
  onUpdateLayer: (id: string, updates: EditorLayerUpdate) => void;
};

export function InspectorPanel({
  content,
  selectedLayer,
  templateId,
  onRemoveLayer,
  onResetLayer,
  onClearContentAsset,
  onUpdateContent,
  onUploadContentAsset,
  onUpdateLayer,
}: InspectorPanelProps) {
  const [localFontFamilies, setLocalFontFamilies] = useState<string[]>([]);
  const [localFontStatus, setLocalFontStatus] = useState("");
  const localFontsRequestedRef = useRef(false);
  const badgeFontOptions =
    localFontFamilies.length > 0 ? localFontFamilies : [content.badgeFontFamily];

  const loadLocalFonts = async () => {
    if (localFontsRequestedRef.current) {
      return;
    }

    localFontsRequestedRef.current = true;

    if (!window.queryLocalFonts) {
      setLocalFontStatus("当前浏览器不支持读取本机字体");
      return;
    }

    try {
      const fonts = await window.queryLocalFonts();
      const availableFamilies = Array.from(
        new Set(fonts.map((font) => font.family).filter(Boolean)),
      ).sort((left, right) => left.localeCompare(right, "zh-CN"));
      const familySet = new Set(availableFamilies);
      const preferredFamilies = preferredFontFamilyOrder.filter((family) => familySet.has(family));
      const preferredFamilySet = new Set(preferredFamilies);
      const families = [
        ...preferredFamilies,
        ...availableFamilies.filter((family) => !preferredFamilySet.has(family)),
      ];

      setLocalFontFamilies(families);
      setLocalFontStatus("");

      if (!familySet.has(content.badgeFontFamily) && families[0]) {
        onUpdateContent({ badgeFontFamily: families[0] });
      }
    } catch {
      localFontsRequestedRef.current = false;
      setLocalFontStatus("未获得本机字体读取权限");
    }
  };

  return (
    <aside
      className="flex min-h-0 flex-col overflow-x-hidden overflow-y-auto border-l border-(--border) bg-white p-5 pt-0 scrollbar-thin scrollbar-color-[#c9ccd0] scrollbar-gutter-stable"
      aria-label="编辑面板"
    >
      <ContentSection defaultOpen title="图层属性">
        {selectedLayer ? (
          <>
            {selectedLayer.type === "text" ? (
              <>
                <FormLabel>
                  文字内容
                  <textarea
                    className={textareaClass}
                    rows={3}
                    value={selectedLayer.text}
                    onChange={(event) =>
                      onUpdateLayer(selectedLayer.id, {
                        text: event.target.value,
                      })
                    }
                  />
                </FormLabel>
                <ControlGrid>
                  <FormLabel>
                    字体
                    <select
                      className={selectClass}
                      value={selectedLayer.fontFamily}
                      onFocus={loadLocalFonts}
                      onPointerDown={loadLocalFonts}
                      onChange={(event) =>
                        onUpdateLayer(selectedLayer.id, {
                          fontFamily: event.target.value,
                        })
                      }
                    >
                      {Array.from(new Set([selectedLayer.fontFamily, ...badgeFontOptions])).map(
                        (fontFamily) => (
                          <option key={fontFamily} value={fontFamily}>
                            {fontFamily}
                          </option>
                        ),
                      )}
                    </select>
                  </FormLabel>
                  <FormLabel>
                    字体大小
                    <input
                      className={inputClass}
                      min="1"
                      step="1"
                      type="number"
                      value={selectedLayer.fontSize}
                      onChange={(event) =>
                        onUpdateLayer(selectedLayer.id, {
                          fontSize: Math.max(1, event.target.valueAsNumber || 1),
                        })
                      }
                    />
                  </FormLabel>
                </ControlGrid>
                <ControlGrid className="mt-4">
                  <FormLabel>
                    字间距
                    <input
                      className={inputClass}
                      step="0.1"
                      type="number"
                      value={selectedLayer.letterSpacing}
                      onChange={(event) =>
                        onUpdateLayer(selectedLayer.id, {
                          letterSpacing: event.target.valueAsNumber || 0,
                        })
                      }
                    />
                  </FormLabel>
                  <FormLabel>
                    行间距
                    <input
                      className={inputClass}
                      min="0.5"
                      step="0.1"
                      type="number"
                      value={selectedLayer.lineHeight}
                      onChange={(event) =>
                        onUpdateLayer(selectedLayer.id, {
                          lineHeight: Math.max(0.5, event.target.valueAsNumber || 1.2),
                        })
                      }
                    />
                  </FormLabel>
                </ControlGrid>
                <ControlGrid className="mt-4">
                  <FormLabel>
                    对齐方式
                    <select
                      className={selectClass}
                      value={selectedLayer.align}
                      onChange={(event) =>
                        onUpdateLayer(selectedLayer.id, {
                          align: event.target.value as "left" | "center" | "right",
                        })
                      }
                    >
                      <option value="left">左对齐</option>
                      <option value="center">居中</option>
                      <option value="right">右对齐</option>
                    </select>
                  </FormLabel>
                  <FormLabel>
                    文字颜色
                    <input
                      className={colorInputClass}
                      type="color"
                      value={selectedLayer.color}
                      onChange={(event) =>
                        onUpdateLayer(selectedLayer.id, {
                          color: event.target.value,
                        })
                      }
                    />
                  </FormLabel>
                </ControlGrid>
                <ControlGrid className="mt-4">
                  <ToggleRow className="self-end">
                    <input
                      className={checkboxClass}
                      checked={selectedLayer.fontWeight >= 700}
                      type="checkbox"
                      onChange={(event) =>
                        onUpdateLayer(selectedLayer.id, {
                          fontWeight: event.target.checked ? 700 : 400,
                        })
                      }
                    />
                    <span>加粗</span>
                  </ToggleRow>
                  <ToggleRow>
                    <input
                      className={checkboxClass}
                      checked={selectedLayer.fontStyle === "italic"}
                      type="checkbox"
                      onChange={(event) =>
                        onUpdateLayer(selectedLayer.id, {
                          fontStyle: event.target.checked ? "italic" : "normal",
                        })
                      }
                    />
                    <span>斜体</span>
                  </ToggleRow>
                </ControlGrid>
                <ControlGrid className="mt-3">
                  <ToggleRow>
                    <input
                      className={checkboxClass}
                      checked={selectedLayer.textDecoration === "underline"}
                      type="checkbox"
                      onChange={(event) =>
                        onUpdateLayer(selectedLayer.id, {
                          textDecoration: event.target.checked ? "underline" : "none",
                        })
                      }
                    />
                    <span>下划线</span>
                  </ToggleRow>
                </ControlGrid>

                <div className="mt-5 border-t border-(--border) pt-4">
                  <ContentPartTitle>文字描边</ContentPartTitle>
                  <ControlGrid>
                    <FormLabel>
                      描边颜色
                      <input
                        className={colorInputClass}
                        type="color"
                        value={selectedLayer.strokeColor}
                        onChange={(event) =>
                          onUpdateLayer(selectedLayer.id, {
                            strokeColor: event.target.value,
                          })
                        }
                      />
                    </FormLabel>
                    <FormLabel>
                      描边宽度
                      <input
                        className={inputClass}
                        min="0"
                        step="0.25"
                        type="number"
                        value={selectedLayer.strokeWidth}
                        onChange={(event) =>
                          onUpdateLayer(selectedLayer.id, {
                            strokeWidth: Math.max(0, event.target.valueAsNumber || 0),
                          })
                        }
                      />
                    </FormLabel>
                  </ControlGrid>
                </div>

                <div className="mt-5 border-t border-(--border) pt-4">
                  <ContentPartTitle>文字阴影</ContentPartTitle>
                  <ToggleRow>
                    <input
                      className={checkboxClass}
                      checked={selectedLayer.shadowEnabled}
                      type="checkbox"
                      onChange={(event) =>
                        onUpdateLayer(selectedLayer.id, {
                          shadowEnabled: event.target.checked,
                        })
                      }
                    />
                    <span>显示阴影</span>
                  </ToggleRow>
                  {selectedLayer.shadowEnabled ? (
                    <>
                      <ControlGrid className="mt-4">
                        <FormLabel>
                          阴影颜色
                          <input
                            className={colorInputClass}
                            type="color"
                            value={selectedLayer.shadowColor}
                            onChange={(event) =>
                              onUpdateLayer(selectedLayer.id, {
                                shadowColor: event.target.value,
                              })
                            }
                          />
                        </FormLabel>
                        <FormLabel>
                          阴影透明度
                          <input
                            className={inputClass}
                            max="1"
                            min="0"
                            step="0.05"
                            type="number"
                            value={selectedLayer.shadowOpacity}
                            onChange={(event) =>
                              onUpdateLayer(selectedLayer.id, {
                                shadowOpacity: Math.min(
                                  1,
                                  Math.max(0, event.target.valueAsNumber || 0),
                                ),
                              })
                            }
                          />
                        </FormLabel>
                      </ControlGrid>
                      <ControlGrid className="mt-4">
                        <FormLabel>
                          模糊
                          <input
                            className={inputClass}
                            min="0"
                            step="0.5"
                            type="number"
                            value={selectedLayer.shadowBlur}
                            onChange={(event) =>
                              onUpdateLayer(selectedLayer.id, {
                                shadowBlur: Math.max(0, event.target.valueAsNumber || 0),
                              })
                            }
                          />
                        </FormLabel>
                        <FormLabel>
                          水平偏移
                          <input
                            className={inputClass}
                            step="0.5"
                            type="number"
                            value={selectedLayer.shadowOffsetX}
                            onChange={(event) =>
                              onUpdateLayer(selectedLayer.id, {
                                shadowOffsetX: event.target.valueAsNumber || 0,
                              })
                            }
                          />
                        </FormLabel>
                      </ControlGrid>
                      <ControlGrid className="mt-4">
                        <FormLabel>
                          垂直偏移
                          <input
                            className={inputClass}
                            step="0.5"
                            type="number"
                            value={selectedLayer.shadowOffsetY}
                            onChange={(event) =>
                              onUpdateLayer(selectedLayer.id, {
                                shadowOffsetY: event.target.valueAsNumber || 0,
                              })
                            }
                          />
                        </FormLabel>
                      </ControlGrid>
                    </>
                  ) : null}
                </div>
                <div className="my-5 border-t border-(--border)" />
              </>
            ) : null}
            <ControlGrid>
              <FormLabel>
                X
                <input
                  className={inputClass}
                  type="number"
                  value={selectedLayer.x}
                  onChange={(event) =>
                    onUpdateLayer(selectedLayer.id, {
                      x: Number(event.target.value),
                    })
                  }
                />
              </FormLabel>
              <FormLabel>
                Y
                <input
                  className={inputClass}
                  type="number"
                  value={selectedLayer.y}
                  onChange={(event) =>
                    onUpdateLayer(selectedLayer.id, {
                      y: Number(event.target.value),
                    })
                  }
                />
              </FormLabel>
              <FormLabel>
                宽
                <input
                  className={inputClass}
                  min="24"
                  type="number"
                  value={selectedLayer.width}
                  onChange={(event) =>
                    onUpdateLayer(selectedLayer.id, {
                      width: Math.max(24, Number(event.target.value)),
                    })
                  }
                />
              </FormLabel>
              <FormLabel>
                高
                <input
                  className={inputClass}
                  min="24"
                  type="number"
                  value={selectedLayer.height}
                  onChange={(event) =>
                    onUpdateLayer(selectedLayer.id, {
                      height: Math.max(24, Number(event.target.value)),
                    })
                  }
                />
              </FormLabel>
              <FormLabel>
                旋转
                <input
                  className={inputClass}
                  type="number"
                  value={selectedLayer.rotation}
                  onChange={(event) =>
                    onUpdateLayer(selectedLayer.id, {
                      rotation: Number(event.target.value),
                    })
                  }
                />
              </FormLabel>
              <FormLabel>
                透明度
                <input
                  className={inputClass}
                  max="1"
                  min="0"
                  step="0.05"
                  type="number"
                  value={selectedLayer.opacity}
                  onChange={(event) =>
                    onUpdateLayer(selectedLayer.id, {
                      opacity: Math.min(1, Math.max(0, Number(event.target.value))),
                    })
                  }
                />
              </FormLabel>
            </ControlGrid>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {selectedLayer.type === "image" ? (
                <>
                  <button
                    className={secondaryButtonClass}
                    type="button"
                    onClick={() =>
                      onUpdateLayer(selectedLayer.id, {
                        flipX: !selectedLayer.flipX,
                      })
                    }
                  >
                    <FlipHorizontal aria-hidden="true" size={16} />
                    水平镜像
                  </button>
                  <button
                    className={secondaryButtonClass}
                    type="button"
                    onClick={() =>
                      onUpdateLayer(selectedLayer.id, {
                        flipY: !selectedLayer.flipY,
                      })
                    }
                  >
                    <FlipVertical aria-hidden="true" size={16} />
                    垂直镜像
                  </button>
                </>
              ) : null}
              <button
                className={secondaryButtonClass}
                type="button"
                onClick={() => onResetLayer(selectedLayer.id)}
              >
                <RotateCcw aria-hidden="true" size={16} />
                重置
              </button>
              <button
                className={dangerButtonClass}
                type="button"
                onClick={() => onRemoveLayer(selectedLayer.id)}
              >
                <Trash2 aria-hidden="true" size={16} />
                删除
              </button>
            </div>
          </>
        ) : (
          <p className="mt-2.5 text-[13px] leading-relaxed text-(--font-muted)">
            选择图片或文字图层后可编辑其属性。
          </p>
        )}
      </ContentSection>

      {templateId === "bilibili-dynamic" ? (
        <>
          <ContentSection
            title="Logo"
            visible={content.showBilibiliBar}
            onVisibleChange={(visible) => onUpdateContent({ showBilibiliBar: visible })}
          >
            <AssetUploadControl
              assetKey="logoUrl"
              hideLabel
              label="Logo 图片"
              value={content.logoUrl}
              onClear={onClearContentAsset}
              onUpload={onUploadContentAsset}
            />
          </ContentSection>

          <ContentSection title="头像区域">
            <div>
              <ContentPartTitle>头像图片</ContentPartTitle>
              <AssetUploadControl
                assetKey="avatarUrl"
                hideLabel
                label="头像图片"
                value={content.avatarUrl}
                onClear={onClearContentAsset}
                onUpload={onUploadContentAsset}
              />
            </div>

            <div className="mt-5 border-t border-(--border) pt-4">
              <ContentPartTitle
                visible={content.showAvatarDecoration}
                onVisibleChange={(visible) => onUpdateContent({ showAvatarDecoration: visible })}
              >
                头像挂件
              </ContentPartTitle>
              <AssetUploadControl
                assetKey="avatarDecorationUrl"
                hideLabel
                label="头像挂件图片"
                value={content.avatarDecorationUrl}
                onClear={onClearContentAsset}
                onUpload={onUploadContentAsset}
              />
            </div>

            <div className="mt-5 border-t border-(--border) pt-4">
              <ContentPartTitle
                visible={content.showAvatarBadge}
                onVisibleChange={(visible) => onUpdateContent({ showAvatarBadge: visible })}
              >
                认证标记
              </ContentPartTitle>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    ["gold", "金色标记", goldAvatarBadge],
                    ["blue", "蓝色标记", blueAvatarBadge],
                  ] as const
                ).map(([style, label, src]) => {
                  const selected = content.avatarBadgeStyle === style;

                  return (
                    <button
                      aria-pressed={selected}
                      className={`flex min-w-0 items-center gap-3 rounded-md border px-3 py-2 text-left transition-colors ${
                        selected
                          ? "border-[#00aeec] bg-[#e5f6fd] text-[#18191c]"
                          : "border-(--border) bg-white text-[#61666d] hover:border-[#00aeec]"
                      }`}
                      key={style}
                      type="button"
                      onClick={() => onUpdateContent({ avatarBadgeStyle: style })}
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-[#f6f7f8]">
                        <span className="grid size-[18px] place-items-center rounded-full bg-white">
                          <img alt="" className="size-4 rounded-full object-contain" src={src} />
                        </span>
                      </span>
                      <span className="truncate text-xs font-medium">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </ContentSection>

          <ContentSection
            title="装扮卡片"
            visible={content.showBadgeImage}
            onVisibleChange={(visible) => onUpdateContent({ showBadgeImage: visible })}
          >
            <FormLabel>
              装扮卡片文字
              <input
                className={inputClass}
                type="text"
                value={content.badgeText}
                onChange={(event) => onUpdateContent({ badgeText: event.target.value })}
              />
            </FormLabel>
            <ControlGrid>
              <FormLabel>
                装扮高度 (像素)
                <input
                  className={inputClass}
                  min="8"
                  step="1"
                  type="number"
                  value={content.badgeImageHeight}
                  onChange={(event) =>
                    onUpdateContent({
                      badgeImageHeight: Math.max(8, Number(event.target.value)),
                    })
                  }
                />
              </FormLabel>
              <FormLabel>
                文字字体
                <select
                  className={selectClass}
                  value={content.badgeFontFamily}
                  onFocus={loadLocalFonts}
                  onChange={(event) => onUpdateContent({ badgeFontFamily: event.target.value })}
                  onPointerDown={loadLocalFonts}
                >
                  {badgeFontOptions.map((fontFamily) => (
                    <option key={fontFamily} value={fontFamily}>
                      {fontFamily}
                    </option>
                  ))}
                </select>
              </FormLabel>
            </ControlGrid>
            {localFontStatus ? <p className={hintClass}>{localFontStatus}</p> : null}
            <ControlGrid className="mt-4">
              <FormLabel>
                字体大小 (像素)
                <input
                  className={inputClass}
                  min="1"
                  step="0.5"
                  type="number"
                  value={getFiniteValue(content.badgeFontSize, 8)}
                  onChange={(event) => {
                    const nextValue = event.target.valueAsNumber;

                    if (Number.isFinite(nextValue)) {
                      onUpdateContent({
                        badgeFontSize: Math.max(1, nextValue),
                      });
                    }
                  }}
                />
              </FormLabel>
              <FormLabel>
                字间距 (像素)
                <input
                  className={inputClass}
                  step="0.1"
                  type="number"
                  value={getFiniteValue(content.badgeLetterSpacing, 0.5)}
                  onChange={(event) => {
                    const nextValue = event.target.valueAsNumber;

                    if (Number.isFinite(nextValue)) {
                      onUpdateContent({ badgeLetterSpacing: nextValue });
                    }
                  }}
                />
              </FormLabel>
            </ControlGrid>
            <ControlGrid className="mt-4">
              <FormLabel>
                文字颜色
                <input
                  className={colorInputClass}
                  type="color"
                  value={content.badgeTextColor}
                  onChange={(event) => onUpdateContent({ badgeTextColor: event.target.value })}
                />
              </FormLabel>
              <ToggleRow className="self-end">
                <input
                  className={checkboxClass}
                  checked={content.badgeFontWeight >= 700}
                  type="checkbox"
                  onChange={(event) =>
                    onUpdateContent({
                      badgeFontWeight: event.target.checked ? 700 : 400,
                    })
                  }
                />
                <span>加粗</span>
              </ToggleRow>
            </ControlGrid>
            <div className="mt-5 border-t border-(--border) pt-4">
              <AssetUploadControl
                assetKey="badgeImageUrl"
                hideLabel
                label="右上装扮卡片图片"
                value={content.badgeImageUrl}
                onClear={onClearContentAsset}
                onUpload={onUploadContentAsset}
              />
            </div>
          </ContentSection>

          <ContentSection defaultOpen title="作者信息">
            <FormLabel>
              昵称
              <input
                className={inputClass}
                type="text"
                value={content.nickname}
                onChange={(event) => onUpdateContent({ nickname: event.target.value })}
              />
            </FormLabel>
            <FormLabel>
              次要信息
              <input
                className={inputClass}
                type="text"
                value={content.timestamp}
                onChange={(event) => onUpdateContent({ timestamp: event.target.value })}
              />
            </FormLabel>
          </ContentSection>

          <ContentSection defaultOpen title="话题与正文">
            <ContentPartTitle
              visible={content.showTopic}
              onVisibleChange={(visible) => onUpdateContent({ showTopic: visible })}
            >
              话题
            </ContentPartTitle>
            <FormLabel>
              <input
                className={inputClass}
                aria-label="话题"
                type="text"
                value={content.topic}
                onChange={(event) => onUpdateContent({ topic: event.target.value })}
              />
            </FormLabel>
            <FormLabel>
              动态正文
              <textarea
                className={textareaClass}
                rows={4}
                value={content.body}
                onChange={(event) => onUpdateContent({ body: event.target.value })}
              />
            </FormLabel>
          </ContentSection>

          <ContentSection title="互动栏">
            <ControlGrid>
              <FormLabel>
                转发
                <input
                  className={inputClass}
                  type="text"
                  value={content.repostCount}
                  onChange={(event) => onUpdateContent({ repostCount: event.target.value })}
                />
              </FormLabel>
              <FormLabel>
                评论
                <input
                  className={inputClass}
                  type="text"
                  value={content.commentCount}
                  onChange={(event) => onUpdateContent({ commentCount: event.target.value })}
                />
              </FormLabel>
              <FormLabel>
                点赞
                <input
                  className={inputClass}
                  type="text"
                  value={content.likeCount}
                  onChange={(event) => onUpdateContent({ likeCount: event.target.value })}
                />
              </FormLabel>
            </ControlGrid>
          </ContentSection>
        </>
      ) : null}
    </aside>
  );
}
