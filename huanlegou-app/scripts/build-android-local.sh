#!/usr/bin/env bash
set -euo pipefail

# Android SDK (Homebrew android-commandlinetools)
export ANDROID_HOME="${ANDROID_HOME:-/opt/homebrew/share/android-commandlinetools}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin"

# JDK: Android Gradle 不能用 GraalVM（jlink 会炸）。优先 Corretto / Temurin 17。
if [[ -z "${JAVA_HOME:-}" ]] || [[ "$JAVA_HOME" == *"graalvm"* ]] || [[ "$JAVA_HOME" == *"GraalVM"* ]]; then
  for candidate in \
    "$HOME"/Library/Java/JavaVirtualMachines/corretto-17*/Contents/Home \
    /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home \
    /Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home; do
    if [[ -d "$candidate" ]]; then
      export JAVA_HOME="$candidate"
      break
    fi
  done
fi

if [[ -z "${JAVA_HOME:-}" ]] || [[ "$JAVA_HOME" == *"graalvm"* ]] || [[ "$JAVA_HOME" == *"GraalVM"* ]]; then
  echo "Error: 需要标准 JDK 17（Corretto / Temurin / OpenJDK），不能用 GraalVM。"
  echo "安装: brew install --cask temurin@17"
  echo "或确认已安装 Amazon Corretto 17"
  exit 1
fi

export PATH="$JAVA_HOME/bin:$PATH"

if [[ ! -d "$ANDROID_HOME/platforms/android-36" ]]; then
  echo "Error: Android SDK 36 not found under $ANDROID_HOME"
  echo "Install with:"
  echo '  sdkmanager "platform-tools" "platforms;android-36" "build-tools;36.0.0"'
  exit 1
fi

echo "Using ANDROID_HOME=$ANDROID_HOME"
echo "Using JAVA_HOME=$JAVA_HOME"
exec eas build --platform android --profile preview --local "$@"
