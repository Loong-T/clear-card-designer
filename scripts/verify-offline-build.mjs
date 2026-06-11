import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const outputDirectory = new URL("../dist/", import.meta.url);
const outputDirectoryPath = fileURLToPath(outputDirectory);
const outputEntries = await readdir(outputDirectory, { recursive: true });
const outputFiles = [];

for (const entry of outputEntries) {
  const entryPath = join(outputDirectoryPath, entry);

  if ((await stat(entryPath)).isFile()) {
    outputFiles.push(entry);
  }
}

if (outputFiles.length !== 1 || outputFiles[0] !== "index.html") {
  throw new Error(`离线构建必须只包含 dist/index.html，当前文件：${outputFiles.join(", ")}`);
}

const html = await readFile(new URL("index.html", outputDirectory), "utf8");
const externalResourcePattern =
  /<(?:script|link|img)\b[^>]*(?:src|href)=["'](?!data:|blob:|#)[^"']+["']/gi;
const externalResources = html.match(externalResourcePattern) ?? [];

if (externalResources.length > 0) {
  throw new Error(`离线构建仍包含外部资源：${externalResources.join(", ")}`);
}

if (!html.includes('id="root"') || !html.includes("<style") || !html.includes("<script")) {
  throw new Error("离线构建缺少应用入口、内联样式或内联脚本");
}

console.log(`离线单文件构建检查通过：dist/index.html (${html.length} bytes)`);
