import { Eye, EyeOff } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import { PanelSectionTitle } from "./PanelSectionTitle";

export type ContentSectionProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  title: string;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
};

export function ContentSection({
  children,
  defaultOpen = false,
  title,
  visible,
  onVisibleChange,
}: ContentSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <details
      className="group mt-3 first:mt-0"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <PanelSectionTitle
        actions={
          onVisibleChange ? (
            <button
              aria-label={visible ? `隐藏${title}` : `显示${title}`}
              className="grid w-7 h-7 place-items-center p-0 border-0 rounded text-(--font-muted) bg-transparent hover:text-(--accent) hover:bg-(--surface)"
              title={visible ? `隐藏${title}` : `显示${title}`}
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onVisibleChange(!visible);
              }}
            >
              {visible ? (
                <Eye aria-hidden="true" size={15} />
              ) : (
                <EyeOff aria-hidden="true" size={15} />
              )}
            </button>
          ) : null
        }
        as="summary"
      >
        {title}
      </PanelSectionTitle>
      <div className="py-4">{children}</div>
    </details>
  );
}
