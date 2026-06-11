import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

type PanelSectionTitleProps = {
  actions?: ReactNode;
  as?: "h2" | "summary";
  children: ReactNode;
};

export function PanelSectionTitle({
  actions,
  as: Component = "h2",
  children,
}: PanelSectionTitleProps) {
  return (
    <Component
      className={`-mx-5 flex min-h-11 w-[calc(100%+40px)] list-none items-center justify-between bg-(--surface) px-5 text-sm font-bold leading-none text-(--font-primary) [&::-webkit-details-marker]:hidden ${
        Component === "summary" ? "cursor-pointer" : ""
      }`}
    >
      <span className="min-w-0 mr-auto">{children}</span>
      {actions ? (
        <span className="inline-flex flex-none items-center gap-1 ml-2">{actions}</span>
      ) : null}
      {Component === "summary" ? (
        <ChevronDown
          aria-hidden="true"
          className="ml-2 shrink-0 text-(--font-muted) transition-transform group-open:rotate-180"
          size={15}
        />
      ) : null}
    </Component>
  );
}
