# Changelog

## Unreleased

### Fixed

- 页面显示的版本号改为自动读取 `package.json`，避免发布时遗漏同步。
- 统一仓库文本文件使用 LF，避免 Windows 工作区因 CRLF 导致格式检查失败。

## 0.1.1 - 2026-06-13

### Fixed

- 恢复哔哩哔哩动态模板在图层列表中的默认“动态信息”图层。

### Changed

- GitHub Release 正文改为自动使用 CHANGELOG 中对应版本的实际发版内容。

## 0.1.0 - 2026-06-11

首个正式版本。

### Added

- 哔哩哔哩动态和空白透卡模板。
- 图片与文字图层的添加、编辑、排序、隐藏和删除。
- 实物尺寸、DPI、出血参考线、透明区域预览和缩放。
- 带透明通道的 PNG 导出。
- 可通过 `file://` 直接运行的单文件离线构建与 ZIP 发布产物。
- GitHub Actions CI 和版本标签自动 Release。
