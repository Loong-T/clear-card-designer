import { hintClass } from "./ui";

export function FontEffectSupportHint() {
  return (
    <p className={`${hintClass} mt-3 mb-0!`}>加粗或斜体不生效时，通常是当前字体不支持对应效果。</p>
  );
}
