# Qwerty Learner Audio Native Module

这是用 Rust 编写的音频播放 native module，支持本地文件和网络 URL。

## 构建说明

### 前置要求

1. 安装 Rust：
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

2. 安装交叉编译工具（可选，用于构建其他平台）

### 构建步骤

1. 安装依赖：
```bash
cd native
npm install
```

2. 构建当前平台：
```bash
npm run build
```

3. 构建所有平台（需要交叉编译工具）：
```bash
npm run build-all
```

### 平台支持

- macOS (ARM64): `mac-arm.node`
- macOS (x64): `mac-intel.node`
- Windows (x64): `win32.node`
- Linux (x64): `linux-x64.node`

## 功能

- 支持本地文件播放 (file:// 或直接文件路径)
- 支持网络 URL (http:// 或 https://)
- 异步播放，不阻塞主线程
- 播放完成后自动调用回调

## API

```typescript
playerPlay(url: string, callback: () => void): void
```

- `url`: 音频文件的 URL 或本地路径
- `callback`: 播放完成后的回调函数
