import type { CSSProperties } from "react";

import type {
  CardContent,
  ImagePreset,
  OutputMode,
  OutputSettings,
  PhysicalPreset,
  PreviewSettings,
} from "../../types/editor";
import { DocumentPropertyGroup } from "./DocumentPropertyGroup";
import { PanelSectionTitle } from "./PanelSectionTitle";
import {
  checkboxClass,
  colorInputClass,
  ControlGrid,
  FormLabel,
  hintClass,
  inputClass,
  selectClass,
  ToggleRow,
} from "./ui";

type DocumentSettingsProps = {
  content: CardContent;
  outputSettings: OutputSettings;
  previewSettings: PreviewSettings;
  onApplyImagePreset: (preset: ImagePreset) => void;
  onApplyPhysicalPreset: (preset: PhysicalPreset) => void;
  onUpdateContent: (updates: Partial<CardContent>) => void;
  onUpdateOutputSettings: (updates: Partial<OutputSettings>) => void;
  onUpdatePreviewSettings: (updates: Partial<PreviewSettings>) => void;
};

export function DocumentSettings({
  content,
  outputSettings,
  previewSettings,
  onApplyImagePreset,
  onApplyPhysicalPreset,
  onUpdateContent,
  onUpdateOutputSettings,
  onUpdatePreviewSettings,
}: DocumentSettingsProps) {
  return (
    <details className="group mt-0 overflow-visible rounded-none border-0" open>
      <PanelSectionTitle as="summary">文档属性</PanelSectionTitle>
      <DocumentPropertyGroup title="用途与尺寸">
        <FormLabel>
          使用方式
          <select
            className={selectClass}
            value={outputSettings.mode}
            onChange={(event) =>
              onUpdateOutputSettings({
                mode: event.target.value as OutputMode,
              })
            }
          >
            <option value="physical">制作实物透卡</option>
            <option value="image">制作普通图片</option>
          </select>
        </FormLabel>
        {outputSettings.mode === "physical" ? (
          <>
            <FormLabel>
              常用成品尺寸
              <select
                className={selectClass}
                value={outputSettings.physicalPreset}
                onChange={(event) => onApplyPhysicalPreset(event.target.value as PhysicalPreset)}
              >
                <option value="65x95">65 x 95 mm</option>
                <option value="85x130">85 x 130 mm</option>
                <option value="100x150">100 x 150 mm</option>
                <option value="custom">自定义尺寸</option>
              </select>
            </FormLabel>
            <ControlGrid className="gap-2">
              <FormLabel>
                成品宽度 (mm)
                <input
                  className={inputClass}
                  min="1"
                  step="0.1"
                  type="number"
                  value={outputSettings.widthMm}
                  onChange={(event) =>
                    onUpdateOutputSettings({
                      physicalPreset: "custom",
                      widthMm: Number(event.target.value),
                    })
                  }
                />
              </FormLabel>
              <FormLabel>
                成品高度 (mm)
                <input
                  className={inputClass}
                  min="1"
                  step="0.1"
                  type="number"
                  value={outputSettings.heightMm}
                  onChange={(event) =>
                    onUpdateOutputSettings({
                      heightMm: Number(event.target.value),
                      physicalPreset: "custom",
                    })
                  }
                />
              </FormLabel>
            </ControlGrid>
          </>
        ) : (
          <>
            <FormLabel>
              常用图片比例
              <select
                className={selectClass}
                value={outputSettings.imagePreset}
                onChange={(event) => onApplyImagePreset(event.target.value as ImagePreset)}
              >
                <option value="2:3">2:3</option>
                <option value="3:4">3:4</option>
                <option value="4:5">4:5</option>
                <option value="9:16">9:16</option>
                <option value="custom">自定义尺寸</option>
              </select>
            </FormLabel>
            <ControlGrid className="gap-2">
              <FormLabel>
                图片宽度 (像素)
                <input
                  className={inputClass}
                  min="1"
                  step="1"
                  type="number"
                  value={outputSettings.widthPx}
                  onChange={(event) =>
                    onUpdateOutputSettings({
                      imagePreset: "custom",
                      widthPx: Number(event.target.value),
                    })
                  }
                />
              </FormLabel>
              <FormLabel>
                图片高度 (像素)
                <input
                  className={inputClass}
                  min="1"
                  step="1"
                  type="number"
                  value={outputSettings.heightPx}
                  onChange={(event) =>
                    onUpdateOutputSettings({
                      heightPx: Number(event.target.value),
                      imagePreset: "custom",
                    })
                  }
                />
              </FormLabel>
            </ControlGrid>
          </>
        )}
      </DocumentPropertyGroup>

      <DocumentPropertyGroup title="外观">
        <FormLabel>
          卡片圆角 (像素)
          <input
            className={inputClass}
            min="0"
            step="1"
            type="number"
            value={content.cardRadius}
            onChange={(event) =>
              onUpdateContent({
                cardRadius: Math.max(0, Number(event.target.value)),
              })
            }
          />
        </FormLabel>
        <FormLabel>
          内容区白色背景
          <div className="grid grid-cols-[minmax(0,1fr)_42px] items-center gap-2.5">
            <input
              className="h-6 p-0 border-0 outline-none bg-transparent"
              max="100"
              min="0"
              step="5"
              style={
                {
                  "--range-progress": `${Math.round(content.panelOpacity * 100)}%`,
                } as CSSProperties
              }
              type="range"
              value={Math.round(content.panelOpacity * 100)}
              onChange={(event) =>
                onUpdateContent({
                  panelOpacity: Number(event.target.value) / 100,
                })
              }
            />
            <output className="text-right text-xs font-bold text-(--font-secondary)">
              {Math.round(content.panelOpacity * 100)}%
            </output>
          </div>
        </FormLabel>
        <p className={`${hintClass} mb-0!`}>100% 为纯白背景，数值越低越透明。</p>
      </DocumentPropertyGroup>

      <DocumentPropertyGroup title="编辑预览">
        <FormLabel>
          预览背景颜色
          <input
            className={colorInputClass}
            type="color"
            value={previewSettings.backgroundColor}
            onChange={(event) =>
              onUpdatePreviewSettings({
                backgroundColor: event.target.value,
              })
            }
          />
        </FormLabel>
        <ToggleRow className="mb-4">
          <input
            className={checkboxClass}
            checked={previewSettings.showTransparencyGrid}
            type="checkbox"
            onChange={(event) =>
              onUpdatePreviewSettings({
                showTransparencyGrid: event.target.checked,
              })
            }
          />
          <span>用方格显示透明区域</span>
        </ToggleRow>
        <p className={`${hintClass} mb-0!`}>只影响编辑时的预览，不会出现在导出的图片中。</p>
      </DocumentPropertyGroup>

      {outputSettings.mode === "physical" ? (
        <DocumentPropertyGroup title="实物制作参考">
          <FormLabel>
            打印清晰度 (DPI)
            <input
              className={inputClass}
              min="72"
              step="1"
              type="number"
              value={outputSettings.dpi}
              onChange={(event) =>
                onUpdateOutputSettings({
                  dpi: Number(event.target.value),
                })
              }
            />
          </FormLabel>
          <FormLabel>
            出血参考线距离 (mm)
            <input
              className={inputClass}
              min="0"
              step="0.1"
              type="number"
              value={outputSettings.bleedMm}
              onChange={(event) =>
                onUpdateOutputSettings({
                  bleedMm: Number(event.target.value),
                })
              }
            />
          </FormLabel>
          <ToggleRow className="mb-4">
            <input
              className={checkboxClass}
              checked={outputSettings.showBleedGuide}
              type="checkbox"
              onChange={(event) =>
                onUpdateOutputSettings({
                  showBleedGuide: event.target.checked,
                })
              }
            />
            <span>显示出血参考线</span>
          </ToggleRow>
          <p className={`${hintClass} mb-0!`}>
            红色虚线提醒你不要把重要内容放得太靠近边缘，不会改变图片尺寸。
          </p>
        </DocumentPropertyGroup>
      ) : null}
    </details>
  );
}
