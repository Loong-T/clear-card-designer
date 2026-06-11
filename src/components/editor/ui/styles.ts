export const fieldBaseClass =
  "w-full rounded-md border border-(--border) bg-white text-(--font-primary) outline-none transition-colors hover:border-[#c9ccd0] focus:border-(--accent) focus:ring-2 focus:ring-[#00aeec]/15";

export const inputClass = `${fieldBaseClass} h-9 px-2.5`;

export const selectClass = `${inputClass} appearance-none pr-9 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2714%27%20height%3D%2714%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27%239499a0%27%20stroke-width%3D%272%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Cpath%20d%3D%27m6%209%206%206%206-6%27%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:14px] bg-[right_11px_center]`;

export const colorInputClass = `${fieldBaseClass} h-9 p-1`;

export const textareaClass = `${fieldBaseClass} min-h-[88px] resize-y p-2.5 leading-[1.5]`;

export const checkboxClass =
  "size-4 shrink-0 cursor-pointer appearance-none rounded border border-[#c9ccd0] bg-white checked:border-(--accent) checked:bg-(--accent) checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%2016%2016%27%3E%3Cpath%20d%3D%27m3.5%208%203%203%206-6%27%20fill%3D%27none%27%20stroke%3D%27%23fff%27%20stroke-width%3D%272%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%2F%3E%3C%2Fsvg%3E')] checked:bg-center checked:bg-no-repeat checked:bg-[length:14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00aeec]/40";

export const secondaryButtonClass =
  "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-(--border) bg-white px-3 text-[13px] font-bold text-(--font-secondary) transition-colors hover:border-(--accent) hover:bg-[#f1fbff] hover:text-(--accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00aeec]/40";

export const dangerButtonClass =
  "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-[#ffe0e8] bg-[#fff5f8] px-3 text-[13px] font-bold text-[#d93664] transition-colors hover:border-[#ff6699] hover:bg-[#fff0f4] hover:text-[#c51f50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6699]/40";

export const hintClass = "-mt-2 mb-3.5 text-xs leading-[1.45] text-(--font-muted)";
