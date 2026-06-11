import type { ReactNode } from "react";

type ControlGridProps = {
  children: ReactNode;
  className?: string;
};

export function ControlGrid({ children, className = "" }: ControlGridProps) {
  return (
    <div className={`grid grid-cols-2 gap-x-3 gap-y-4 [&>label]:mb-0 ${className}`}>{children}</div>
  );
}
