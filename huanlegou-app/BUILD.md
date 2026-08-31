# 欢乐购 移动端打包

```
merchant-link/
├── huanlegou-prototype/   # HTML 原型 → 部署到 Vercel
└── huanlegou-app/         # Expo 壳，WebView 加载远程 HTTPS
    └── src/config/constants.ts   # 默认 URL、版本号（唯一来源）
```

## 架构

```
huanlegou-prototype  ──deploy──▶  https://huanlegou.vercel.app
                                        ▲
huanlegou-app (WebView)  ───────────────┘
```

改 UI 只需重新部署页面，**通常不用重打 APK**。

---

## 配置页面地址

默认值在 `src/config/constants.ts` 的 `DEFAULT_WEB_APP_URL`。

打其他环境包时：

```bash
EXPO_PUBLIC_WEB_APP_URL=https://你的域名.vercel.app npm run build:android
```

---

## 打 Android APK

```bash
cd huanlegou-app
export EXPO_TOKEN="..."
npm run build:android
```

---

## 本地调试

```bash
cd huanlegou-prototype && npx serve . -p 4173
cd huanlegou-app && EXPO_PUBLIC_WEB_APP_URL=http://127.0.0.1:4173 npm start
```

---

## 常见问题

| 问题 | 处理 |
|------|------|
| 魅族秒退、零 UI | 装 **v1.0.5+**（FormData 启动修复），见 [DIAGNOSTICS.md](./DIAGNOSTICS.md) |
| 白屏 / 加载失败 | 确认 Vercel 已部署且手机能访问 HTTPS |
| 改了 UI 没变化 | 重新 deploy 页面；杀进程重开 App |
