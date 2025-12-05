# Qwerty Learner 安装指南

## 安装扩展

有两种方式安装已打包的 `.vsix` 扩展：

### 方法 1: 通过 VS Code 界面安装

1. 打开 VS Code
2. 按下 `Cmd+Shift+P` (macOS) 或 `Ctrl+Shift+P` (Windows/Linux) 打开命令面板
3. 输入 `Extensions: Install from VSIX...`
4. 选择 `qwerty-learner-0.3.9.vsix` 文件
5. 等待安装完成，可能需要重新加载窗口

### 方法 2: 通过命令行安装

```bash
code --install-extension qwerty-learner-0.3.9.vsix
```

## 验证安装

1. 按下 `Cmd+Shift+P` (macOS) 或 `Ctrl+Shift+P` (Windows/Linux)
2. 输入 `Qwerty Learner Start/Pause`
3. 如果能看到该命令，说明安装成功

## 使用说明

### 启动扩展

- 快捷键: `Ctrl+Shift+Q` (macOS) 或 `Shift+Alt+Q` (Windows/Linux)
- 或者通过命令面板运行 `Qwerty Learner Start/Pause`

### 配置本地音频

1. **启用本地音频功能**:
   - 打开设置 (`Cmd+,` / `Ctrl+,`)
   - 搜索 `qwerty-learner.useLocalAudio`
   - 勾选此选项

2. **下载音频文件**:
   - 按下 `Cmd+Shift+P` / `Ctrl+Shift+P`
   - 运行命令 `Qwerty Learner Download Dictionary Audios`
   - 选择要下载的词典和发音类型（美音/英音）
   - 等待下载完成

3. **检查音频状态**:
   - 运行命令 `Qwerty Learner Check Audio Status`
   - 可以查看已下载的音频数量和大小

4. **清理音频文件** (可选):
   - 运行命令 `Qwerty Learner Clean Dictionary Audios`
   - 可以删除不需要的音频文件以节省空间

### 配置选项

在 VS Code 设置中搜索 `qwerty-learner` 可以看到所有配置项：

- **voiceType**: 发音类型 (us/uk/close)
- **useLocalAudio**: 优先使用本地音频
- **downloadVoiceTypes**: 下载时包含的发音类型
- **keySound**: 是否开启键盘音
- **phonetic**: 是否显示音标
- **chapterLength**: 每章节单词数
- **wordExerciseTime**: 每个单词的练习次数
- 更多配置...

## 特性

✅ **本地音频播放**: 支持本地 MP3 音频文件播放，无需网络
✅ **快速切换**: 切换单词时自动停止上一个音频
✅ **即时响应**: 优化的音频停止机制，响应更快
✅ **多词典支持**: 包含 CET4、CET6、IELTS、TOEFL 等多个词典
✅ **自定义配置**: 可配置章节长度、练习次数、音标显示等

## 技术架构

- **Native 音频模块**: 使用 Rust + rodio 实现高性能音频播放
- **支持平台**: macOS (ARM64), Windows, Linux
- **音频格式**: MP3, WAV, FLAC

## 常见问题

### 没有声音？

1. 检查 `voiceType` 设置是否为 "close"（关闭）
2. 如果启用了 `useLocalAudio`，确保已下载对应词典的音频
3. 检查系统音量和静音设置

### 音频下载失败？

- 确保网络连接正常
- 有道 API 可能有频率限制，下载大量音频时请耐心等待
- 可以多次运行下载命令，已下载的文件会自动跳过

### 扩展安装后不显示？

- 尝试重新加载窗口：`Developer: Reload Window`
- 检查是否安装成功：查看扩展列表中是否有 "Qwerty Learner"

## 卸载

1. 打开扩展面板 (`Cmd+Shift+X` / `Ctrl+Shift+X`)
2. 找到 "Qwerty Learner"
3. 点击卸载按钮
4. 如果下载了音频文件，它们会保存在扩展目录中，卸载时会自动删除

## 更新日志

### v0.3.9

- ✨ 新增本地音频播放支持
- ✨ 新增音频下载管理功能
- 🚀 优化音频停止机制，切换更流畅
- 🐛 修复音频播放重叠问题
- 🔧 使用 Rust native 模块提升性能

## 反馈与支持

如有问题或建议，欢迎提交 Issue。
