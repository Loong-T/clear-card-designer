import type { ReactNode } from "react";

type DocumentPropertyGroupProps = {
  children: ReactNode;
  title: string;
};

export function DocumentPropertyGroup({ children, title }: DocumentPropertyGroupProps) {
  return (
    <section className="border-b border-(--border) py-4">
      <h3 className="mb-3 text-[13px] font-bold text-(--font-primary)">{title}</h3>
      {children}
    </section>
  );
}
