# 欢乐购 移动端打包

```
merchant-link/
├── huanlegou-prototype/   # HTML 原型 → 部署到 Vercel
└── huanlegou-app/         # Expo 壳，WebView 加载远程 HTTPS
    └── config/defaults.js          # 默认 URL、版本号（唯一来源）
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

默认值在 `config/defaults.js` 的 `DEFAULT_WEB_APP_URL`。

打其他环境包时：

```bash
EXPO_PUBLIC_WEB_APP_URL=https://你的域名.vercel.app npm run build:android:local
```

---

## 打 Android APK（本地）

不在 GitHub Actions 触发 EAS 云端队列；统一本地打包。

**环境（Mac，一次性）：**

```bash
brew install --cask android-commandlinetools
# ~/.zshrc 需有：
#   export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
#   export PATH=$PATH:$ANDROID_HOME/platform-tools:...

sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0"
yes | sdkmanager --licenses

eas login   # 或 export EXPO_TOKEN=...
```

**打包：**

```bash
cd huanlegou-app
npm run build:android:local   # 脚本会自动设置 ANDROID_HOME + JAVA_HOME
# 产物：当前目录 build-*.apk
adb install -r build-*.apk
```

**JDK 要求：** 必须用标准 JDK 17（Corretto / Temurin），**不能用 GraalVM**。  
若 Gradle 报 `JdkImageTransform` / `jlink` 失败，确认：

```bash
echo $JAVA_HOME
# 应类似 .../corretto-17... 或 .../temurin-17...
java -version
```

若 `JAVA_HOME` 指向 GraalVM，执行：

```bash
export JAVA_HOME="$HOME/Library/Java/JavaVirtualMachines/corretto-17.0.8/Contents/Home"
npm run build:android:local
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
