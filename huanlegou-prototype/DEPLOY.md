# 页面服务器部署（Vercel）

App 壳通过 WebView 加载这里的 HTTPS 页面，不再打包本地 HTML。

## 一键部署

1. 打开 https://vercel.com/new  
2. Import 仓库 `jianping2024/huanlegou`  
3. **Root Directory** 设为 `huanlegou-prototype`  
4. Deploy  

部署完成后得到地址，例如 `https://huanlegou-xxx.vercel.app`

## 告诉 App 用这个地址

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
