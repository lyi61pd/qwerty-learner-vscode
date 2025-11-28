#!/bin/bash

# 本地音频功能测试脚本

echo "🎵 Qwerty Learner 本地音频功能测试"
echo "=================================="
echo ""

# 检查 Node.js 环境
echo "✓ 检查 Node.js 环境..."
if ! command -v node &> /dev/null; then
    echo "❌ 未安装 Node.js"
    exit 1
fi
echo "  Node 版本: $(node -v)"
echo ""

# 检查 yarn
echo "✓ 检查包管理器..."
if ! command -v yarn &> /dev/null; then
    echo "⚠️  未安装 yarn，将使用 npm"
    PKG_MANAGER="npm"
else
    echo "  使用 yarn"
    PKG_MANAGER="yarn"
fi
echo ""

# 安装依赖
echo "✓ 安装依赖..."
if [ "$PKG_MANAGER" = "yarn" ]; then
    yarn install
else
    npm install
fi
echo ""

# 编译项目
echo "✓ 编译项目..."
if [ "$PKG_MANAGER" = "yarn" ]; then
    yarn compile
else
    npm run compile
fi
echo ""

# 检查必要文件
echo "✓ 检查必要文件..."
FILES=(
    "src/utils/AudioManager.ts"
    "assets/audios"
    "AUDIO_FEATURE.md"
)

for file in "${FILES[@]}"; do
    if [ -e "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ❌ $file 不存在"
        exit 1
    fi
done
echo ""

# 检查配置
echo "✓ 检查 package.json 配置..."
if grep -q "qwerty-learner.useLocalAudio" package.json; then
    echo "  ✓ useLocalAudio 配置已添加"
else
    echo "  ❌ 缺少 useLocalAudio 配置"
    exit 1
fi

if grep -q "qwerty-learner.downloadVoiceTypes" package.json; then
    echo "  ✓ downloadVoiceTypes 配置已添加"
else
    echo "  ❌ 缺少 downloadVoiceTypes 配置"
    exit 1
fi

if grep -q "qwerty-learner.downloadDictionaryAudios" package.json; then
    echo "  ✓ downloadDictionaryAudios 命令已添加"
else
    echo "  ❌ 缺少 downloadDictionaryAudios 命令"
    exit 1
fi
echo ""

# 打包测试
echo "✓ 测试打包..."
if [ "$PKG_MANAGER" = "yarn" ]; then
    yarn compile
else
    npm run compile
fi

if [ $? -eq 0 ]; then
    echo "  ✓ 编译成功"
else
    echo "  ❌ 编译失败"
    exit 1
fi
echo ""

echo "=================================="
echo "✅ 所有测试通过！"
echo ""
echo "📚 接下来的步骤："
echo "1. 在 VSCode 中按 F5 启动调试"
echo "2. 打开命令面板测试新命令："
echo "   - Qwerty Learner Download Dictionary Audios"
echo "   - Qwerty Learner Check Audio Status"
echo "   - Qwerty Learner Clean Dictionary Audios"
echo ""
echo "3. 在设置中启用本地音频："
echo "   \"qwerty-learner.useLocalAudio\": true"
echo ""
echo "📖 详细文档: AUDIO_FEATURE.md"
