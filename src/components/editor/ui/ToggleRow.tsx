import type { ReactNode } from "react";

type ToggleRowProps = {
  children: ReactNode;
  className?: string;
};

export function ToggleRow({ children, className = "" }: ToggleRowProps) {
  return (
    <label
      className={`flex min-h-9 items-center gap-2 rounded-md border border-(--border) bg-(--surface) px-2.5 py-2 text-[13px] font-semibold text-(--font-secondary) transition-colors hover:border-[#c9ccd0] hover:bg-white ${className}`}
    >
      {children}
    </label>
  );
}
