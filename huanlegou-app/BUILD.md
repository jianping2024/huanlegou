# 欢乐购 移动端打包

```
merchant-link/
├── huanlegou-prototype/   # HTML 原型（改 UI 在这里）
└── huanlegou-app/         # Expo 壳（Android / iOS 共用）
    ├── web/               # sync 产物，构建时打进原生包
    ├── src/
    │   ├── WebApp.tsx
    │   └── config/localWeb.ts   # 各平台本地 HTML 路径
    └── eas.json           # preview = 内测安装包
```

## 一次性准备

```bash
cd huanlegou-app
export EXPO_TOKEN="你的token"
npx eas-cli@latest whoami   # 应显示 yuanlingqi
```

Token：https://expo.dev/settings/access-tokens

---

## Android 内测 APK

```bash
cd huanlegou-app
npm run build:android
```

完成后在 https://expo.dev/accounts/yuanlingqi/projects/huanlegou/builds 下载 `.apk`，用文件管理器安装。

---

## iOS 内测 IPA

**前提：** Apple Developer 账号（$99/年）。首次构建时 EAS 会引导配置证书。

### 1. 注册测试设备（Ad Hoc 必须）

每台要安装的 iPhone 先登记 UDID：

```bash
cd huanlegou-app
npm run device:register
```

终端会给出链接/二维码，用 **iPhone Safari** 打开并按提示安装描述文件。

### 2. 云端打 IPA

```bash
cd huanlegou-app
npm run build:ios
```

### 3. 安装到 iPhone

1. 构建完成后，用 **iPhone Safari** 打开 Expo 构建页上的安装链接  
2. 按提示安装描述文件 / 应用  
3. **设置 → 通用 → VPN 与设备管理** 信任开发者证书  

> iOS 不能像 Android 那样随便传 apk 文件；设备必须先 `device:register`，且只能装在该次构建包含的设备上。

---

## 更新原型后重新打包

```bash
# 1. 改 huanlegou-prototype/
# 2. 同步并构建
cd huanlegou-app
npm run sync:web
npm run build:android   # 或 build:ios
```

---

## GitHub Actions

- push `main` → 自动打 **Android**
- 手动 Run workflow 可选 **ios** 或 **android**

仓库 Secret：`EXPO_TOKEN`

---

## 常见问题

| 问题 | 处理 |
|------|------|
| `Not logged in` | 检查 `EXPO_TOKEN` |
| iOS 安装灰色 / 无法安装 | 先 `npm run device:register`，再重新 `build:ios` |
| iOS 提示未受信任 | 设置 → 通用 → VPN 与设备管理 → 信任 |
| Android 安装无反应 | 文件管理器打开 apk，勿用微信内置浏览器 |
| 白屏 / 闪退 | 确认装的是最新构建（含 android_asset / iOS web  bundle） |
