import { Eye, EyeOff } from "lucide-react";
import type { ReactNode } from "react";

export type ContentPartTitleProps = {
  children: ReactNode;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
};

export function ContentPartTitle({ children, visible, onVisibleChange }: ContentPartTitleProps) {
  return (
    <div className="mb-3 flex min-h-7 items-center justify-between">
      <strong className="text-[13px] leading-5 text-[#18191c]">{children}</strong>
      {onVisibleChange ? (
        <button
          aria-label={visible ? `隐藏${children}` : `显示${children}`}
          className="grid w-7 h-7 place-items-center p-0 border-0 rounded text-(--font-muted) bg-transparent hover:text-(--accent) hover:bg-(--surface)"
          title={visible ? "隐藏" : "显示"}
          type="button"
          onClick={() => onVisibleChange(!visible)}
        >
          {visible ? <Eye aria-hidden="true" size={15} /> : <EyeOff aria-hidden="true" size={15} />}
        </button>
      ) : null}
    </div>
  );
}
