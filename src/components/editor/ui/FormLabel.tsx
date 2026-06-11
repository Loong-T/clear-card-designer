import type { ReactNode } from "react";

type FormLabelProps = {
  children: ReactNode;
  className?: string;
};

export function FormLabel({ children, className = "" }: FormLabelProps) {
  return (
    <label
      className={`mb-4 grid gap-2 text-[13px] font-semibold text-(--font-secondary) ${className}`}
    >
      {children}
    </label>
  );
}
