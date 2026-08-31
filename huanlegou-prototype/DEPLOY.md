# 页面服务器部署（Vercel）

App 壳通过 WebView 加载这里的 HTTPS 页面。

## 一键部署

**方式 A（推荐，不用找 Root Directory）**

仓库根目录已有 `vercel.json`（`"rootDirectory": "huanlegou-prototype"`），push 后 Vercel 会自动重新部署。

1. 确认 GitHub 已同步最新代码
2. Vercel 项目 → **Deployments** → 最新一条 → **Redeploy**

**方式 B（新建项目时）**

1. https://vercel.com/new → Import `jianping2024/huanlegou`
2. 在 Import 页面若出现 **Root Directory** → 点 **Edit** → 选 `huanlegou-prototype`
3. Framework 选 **Other** → Deploy

**方式 C（在 Settings 里改，新版 UI 路径）**

```
项目页 → 顶部 Settings
→ 左侧 Build and Deployment
→ 页面往下滚 → Root Directory
→ 填 huanlegou-prototype → Save → Redeploy
```

找不到 Root Directory 时用 **方式 A** 即可。

## 404 排查

| 现象 | 处理 |
|------|------|
| 整站 404 | Root Directory 设为 `huanlegou-prototype`，然后 **Redeploy** |
| 只有图片 404 | 确认 `assets/` 已 push 到 GitHub |
| 预览 URL 404 | 用 Production 域名（Settings → Domains），不要用带 hash 的 preview 链 |

## 配置 App

在 `huanlegou-app/eas.json` 的 `preview.env` 里改：

```json
"EXPO_PUBLIC_WEB_APP_URL": "https://你的域名.vercel.app"
```

或在 `huanlegou-app/app.config.ts` 里改 `DEFAULT_WEB_APP_URL`。

然后重新 `npm run build:android`。

## 本地预览服务器

```bash
cd huanlegou-prototype
npx serve . -p 4173
# 浏览器打开 http://localhost:4173
```

手机调试 App 时，把 `EXPO_PUBLIC_WEB_APP_URL` 设为本机局域网 IP（需同一 WiFi）。

## 更新页面

改 `huanlegou-prototype/` 后 push，Vercel 会自动重新部署；**不用重新打 APK**（除非改 App 壳本身）。
