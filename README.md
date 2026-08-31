# 欢乐购 (huanlegou)

B2B 批发采购 App 静态演示：HTML 原型 + Expo Android/iOS 壳。

## 结构

```
merchant-link/
├── huanlegou-prototype/   # 移动端 HTML/CSS/JS 原型
├── huanlegou-app/         # Expo WebView 壳
│   └── config/defaults.js          # 默认 URL、版本（唯一来源）
└── vercel.json
```

## 在线预览

https://huanlegou.vercel.app/index.html

## 打 APK

见 [huanlegou-app/BUILD.md](huanlegou-app/BUILD.md)

## 魅族闪退

v1.0.5 修复 FormData 启动崩溃。详见 [huanlegou-app/DIAGNOSTICS.md](huanlegou-app/DIAGNOSTICS.md)
