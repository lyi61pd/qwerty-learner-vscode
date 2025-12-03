#!/bin/bash

# 构建 Rust native module 的脚本

set -e

echo "Building native audio module..."

cd native

# 检查 Rust 是否安装
if ! command -v cargo &> /dev/null; then
    echo "Error: Rust is not installed. Please install Rust first:"
    echo "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi

# 构建 release 版本
echo "Building release version..."
cargo build --release

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# 复制构建产物到 src/resource/voice/rodio/
echo "Copying artifacts..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    ARCH=$(uname -m)
    if [[ "$ARCH" == "arm64" ]]; then
        cp target/release/libqwerty_learner_audio.dylib ../src/resource/voice/rodio/mac-arm.node
        echo "✓ Built for macOS ARM64"
    else
        cp target/release/libqwerty_learner_audio.dylib ../src/resource/voice/rodio/mac-intel.node
        echo "✓ Built for macOS Intel"
    fi
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    cp target/release/libqwerty_learner_audio.so ../src/resource/voice/rodio/linux-x64.node
    echo "✓ Built for Linux x64"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    cp target/release/qwerty_learner_audio.dll ../src/resource/voice/rodio/win32.node
    echo "✓ Built for Windows x64"
fi

echo "✅ Build completed successfully!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run compile' in the root directory"
echo "2. Press F5 to test the extension"
