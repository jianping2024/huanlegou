# 欢乐购 Android 云端打包

## 已配置内容

- `huanlegou-app`：Expo 壳 + WebView，内嵌 `huanlegou-prototype` 静态页
- `eas.json`：`preview` 配置输出 **APK**（可直接安装）
- `npm run sync:web`：同步 HTML 原型到 `web/` 并生成资源清单

## 一次性：登录 Expo

1. 注册账号：https://expo.dev/signup  
2. 在项目目录登录：

```bash
cd huanlegou-app
export EXPO_TOKEN="你的token"
npx eas-cli@latest whoami
```

## 首次：关联 EAS 项目

```bash
cd huanlegou-app
npx eas-cli@latest init
```

选择 **Create a new project**，会写入 `app.json` 里的 `projectId`。

## 云端打 APK

```bash
cd huanlegou-app
npm run build:android
```

等价于（`EAS_NO_VCS=1` 会把本地已 sync 的 `web/` 一并上传，云端没有 `huanlegou-prototype` 目录）：

```bash
npm run sync:web
EAS_NO_VCS=1 npx eas-cli@latest build --platform android --profile preview
```

构建在 Expo 云端进行（约 10–20 分钟）。完成后终端会给出 **下载链接**，也可在 https://expo.dev 控制台 → Projects → huanlegou → Builds 下载。

## 给客户扫码安装

1. 从 EAS 下载 `.apk`  
2. 上传到 [蒲公英 pgyer.com](https://www.pgyer.com) 或 fir.im  
3. 使用平台提供的 **二维码 / 短链接** 发给客户  

## 更新原型后重新打包

```bash
# 1. 改 huanlegou-prototype 里的 HTML/CSS/JS
# 2. 同步并重新云端构建
cd huanlegou-app
npm run build:android
```

## 常见问题

| 问题 | 处理 |
|------|------|
| `Not logged in` | `export EXPO_TOKEN=...` 或 `npx eas login` |
| 缺少 `projectId` | 运行 `npx eas init` |
| Prebuild 失败 / 缺 web | 确保先 `npm run sync:web`，并用 `EAS_NO_VCS=1` 构建 |
| 安装提示未知来源 | 手机设置中允许安装未知应用 |
