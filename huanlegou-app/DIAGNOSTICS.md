# 魅族 / Android 启动问题

## 根因（已确认，logcat 2026-08-31）

```
ReferenceError: Property 'FormData' doesn't exist
Fatal signal 6 (SIGABRT) in mqt_v_js
```

**不是 WebView 问题。** JS 在 Expo winter runtime 初始化 `FormData` 之前就崩溃，Activity 189ms 内被系统杀掉，所以零 UI、立刻回桌面。

**修复（v1.0.5）：** `index.ts` 第一行 `import 'expo/src/winter/runtime.native'`。

---

## 若仍有问题

### Chrome 测试

https://huanlegou.vercel.app/index.html — 能打开则网络与部署正常。

### logcat

```bash
adb logcat -c
adb logcat | grep -iE "huanlegou|ReactNative|AndroidRuntime|FATAL|FormData"
```

点开 App 后复制含 `FATAL` / `ReactNativeJS` 的行。

---

## Mac 连魅族

1. 我的手机 → 连点版本号 7 次 → 开发者选项  
2. USB 调试 + 文件传输  
3. `adb devices` 出现 `device`
