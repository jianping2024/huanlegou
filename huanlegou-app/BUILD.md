# 欢乐购 移动端打包

```
merchant-link/
├── huanlegou-prototype/   # HTML 原型 → 部署到 Vercel 等静态服务器
└── huanlegou-app/         # Expo 壳，WebView 打开远程 HTTPS 页面
    └── src/config/appWebUrl.ts
```

## 架构

App **不再打包本地 HTML**，改为加载远程页面：

```
huanlegou-prototype  ──deploy──▶  https://xxx.vercel.app
                                        ▲
huanlegou-app (WebView)  ───────────────┘
```

改 UI 只需重新部署页面，**通常不用重打 APK**。

---

## 1. 部署页面服务器（首次）

见 [huanlegou-prototype/DEPLOY.md](../huanlegou-prototype/DEPLOY.md)

Vercel Import 仓库，Root Directory 选 **`huanlegou-prototype`**。

---

## 2. 配置 App 里的页面地址

在 `eas.json` → `preview.env` 改：

```json
"EXPO_PUBLIC_WEB_APP_URL": "https://你的域名.vercel.app"
```

---

## 3. 打 Android APK

```bash
cd huanlegou-app
export EXPO_TOKEN="你的token"
npm run build:android
```

下载：https://expo.dev/accounts/yuanlingqi/projects/huanlegou/builds

---

## iOS 内测

需要 Apple Developer（$99/年）。先 `npm run device:register`，再 `npm run build:ios`。

---

## 本地调试

```bash
# 页面
cd huanlegou-prototype && npx serve . -p 4173

# App（可选，指向本地局域网 IP）
cd huanlegou-app
EXPO_PUBLIC_WEB_APP_URL=http://192.168.x.x:4173 npm start
```

---

## 常见问题

| 问题 | 处理 |
|------|------|
| 白屏 / 加载失败 | 确认 Vercel 已部署且手机能访问该 HTTPS 地址 |
| 改了 UI 没变化 | 重新 deploy 页面；App 有缓存时可杀进程重开 |
| Android 仍闪退 | 装 v1.0.3+，已改为 HTTPS 远程加载 |
