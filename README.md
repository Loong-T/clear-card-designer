# Clear Card Designer

透卡生成器。项目目标是通过本地网页编辑透卡内容、图片图层、尺寸和导出参数，并生成带透明区域的 PNG。

## 当前能力

- B 站动态风格竖版模板
- 多图片图层上传、拖拽、缩放、旋转、镜像、层级调整
- 动态正文、互动数据、模块显示编辑
- 实物尺寸模式：常见 mm 尺寸、DPI、出血参考线
- 纯图片模式：常见竖版比例和自定义像素尺寸
- 通过 `dom-to-image-more` 导出透明 PNG

## 开发命令

```bash
pnpm install
pnpm dev
pnpm check
pnpm test
```

## 离线使用与分发

运行 `pnpm build` 后，生产构建会生成单文件 `dist/index.html`。该文件已内联运行所需的
JavaScript、CSS、图片和 SVG，可以直接复制、压缩分发；用户解压后双击
`index.html` 即可离线使用，无需安装 Node.js 或启动本地服务器。

构建结束后会自动校验 `dist/` 仅包含单文件 HTML，且产物中不存在外部资源引用。

建议使用最新版桌面 Chrome 或 Edge。读取本机字体需要浏览器支持并由用户授权；不可用时，
编辑器会继续使用当前字体和系统字体降级，不影响其他功能。

## CI 与发布

推送到 `main` 分支或创建面向 `main` 的 Pull Request 时，GitHub Actions 会自动运行
`pnpm check` 和 `pnpm test`。

正式发布时，先将 `package.json` 中的版本号更新为目标版本，再推送同版本的
`vX.Y.Z` 标签。Release 工作流会构建并验证单文件网页，生成仅包含 `index.html` 的离线
ZIP 包及 SHA-256 校验文件，并自动发布到 GitHub Releases。

## 素材版权

`src/assets` 下与哔哩哔哩相关的 Logo、图标、装饰及图片素材，其版权及相关权利归
哔哩哔哩所有，不包含在本项目的 MIT 许可证授权范围内。本项目与哔哩哔哩无隶属、授权或
官方合作关系，相关素材仅用于实现模板展示效果。

## 项目结构

```text
src/app/                 应用入口、状态编排和全局样式
src/assets/              内置本地素材
src/components/card/     卡片预览和导出目标
src/components/editor/   编辑器面板与图层控件
src/templates/           模板默认内容和尺寸预设
src/types/               跨模块共享类型
src/utils/               导出、图片加载、图层创建和尺寸计算
scripts/                 构建校验脚本
```
