import type { CardContent } from "../../types/editor";
import { DocumentPropertyGroup } from "./DocumentPropertyGroup";
import { FontEffectSupportHint } from "./FontEffectSupportHint";
import { FontFamilySelect } from "./FontFamilySelect";
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
import { useLocalFonts } from "./useLocalFonts";

type CardTypographySettingsProps = {
  content: CardContent;
  onUpdateContent: (updates: Partial<CardContent>) => void;
};

export function CardTypographySettings({ content, onUpdateContent }: CardTypographySettingsProps) {
  const { loadLocalFonts, localFontFamilies, localFontStatus } = useLocalFonts();

  return (
    <details className="group mt-0 overflow-visible rounded-none border-0" open>
      <PanelSectionTitle as="summary">整体字体</PanelSectionTitle>
      <DocumentPropertyGroup title="模板文字">
        <FormLabel>
          字体
          <FontFamilySelect
            localFontFamilies={localFontFamilies}
            value={content.cardFontFamily}
            onChange={(cardFontFamily) => onUpdateContent({ cardFontFamily })}
            onLoadLocalFonts={loadLocalFonts}
          />
        </FormLabel>
        {localFontStatus ? <p className={hintClass}>{localFontStatus}</p> : null}
        <ControlGrid>
          <FormLabel>
            整体加粗
            <select
              className={selectClass}
              value={content.cardFontWeight}
              onChange={(event) => onUpdateContent({ cardFontWeight: Number(event.target.value) })}
            >
              <option value="0">模板默认</option>
              <option value="400">不加粗</option>
              <option value="700">加粗</option>
            </select>
          </FormLabel>
          <FormLabel>
            字间距 (像素)
            <input
              className={inputClass}
              step="0.1"
              type="number"
              value={content.cardLetterSpacing}
              onChange={(event) =>
                onUpdateContent({ cardLetterSpacing: event.target.valueAsNumber || 0 })
              }
            />
          </FormLabel>
        </ControlGrid>
        <ToggleRow className="mt-4">
          <input
            className={checkboxClass}
            checked={content.cardFontStyle === "italic"}
            type="checkbox"
            onChange={(event) =>
              onUpdateContent({ cardFontStyle: event.target.checked ? "italic" : "normal" })
            }
          />
          <span>整体斜体</span>
        </ToggleRow>
        <FontEffectSupportHint />
        <p className={`${hintClass} mt-3 mb-0!`}>
          作用于模板结构化文字；装扮卡片和自定义文字图层仍使用各自设置。
        </p>
      </DocumentPropertyGroup>

      <DocumentPropertyGroup title="文字阴影">
        <ToggleRow>
          <input
            className={checkboxClass}
            checked={content.cardTextShadowEnabled}
            type="checkbox"
            onChange={(event) => onUpdateContent({ cardTextShadowEnabled: event.target.checked })}
          />
          <span>显示整体阴影</span>
        </ToggleRow>
        {content.cardTextShadowEnabled ? (
          <>
            <ControlGrid className="mt-4">
              <FormLabel>
                阴影颜色
                <input
                  className={colorInputClass}
                  type="color"
                  value={content.cardTextShadowColor}
                  onChange={(event) => onUpdateContent({ cardTextShadowColor: event.target.value })}
                />
              </FormLabel>
              <FormLabel>
                模糊
                <input
                  className={inputClass}
                  min="0"
                  step="0.5"
                  type="number"
                  value={content.cardTextShadowBlur}
                  onChange={(event) =>
                    onUpdateContent({
                      cardTextShadowBlur: Math.max(0, event.target.valueAsNumber || 0),
                    })
                  }
                />
              </FormLabel>
            </ControlGrid>
            <ControlGrid className="mt-4">
              <FormLabel>
                水平偏移
                <input
                  className={inputClass}
                  step="0.5"
                  type="number"
                  value={content.cardTextShadowOffsetX}
                  onChange={(event) =>
                    onUpdateContent({ cardTextShadowOffsetX: event.target.valueAsNumber || 0 })
                  }
                />
              </FormLabel>
              <FormLabel>
                垂直偏移
                <input
                  className={inputClass}
                  step="0.5"
                  type="number"
                  value={content.cardTextShadowOffsetY}
                  onChange={(event) =>
                    onUpdateContent({ cardTextShadowOffsetY: event.target.valueAsNumber || 0 })
                  }
                />
              </FormLabel>
            </ControlGrid>
          </>
        ) : null}
      </DocumentPropertyGroup>
    </details>
  );
}
