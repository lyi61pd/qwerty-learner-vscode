# 本地音频功能使用说明

## 功能概述

新增本地音频功能，支持将词典的单词发音下载到本地，提升使用体验：
- ✅ 无需网络即可播放发音
- ✅ 播放速度更快，无延迟
- ✅ 支持美音和英音选择
- ✅ 批量下载整个词典
- ✅ 查看下载状态和存储占用

## 配置选项

### 1. 启用本地音频
在设置中搜索 `qwerty-learner`，配置以下选项：

**`qwerty-learner.useLocalAudio`**
- 类型: `boolean`
- 默认值: `false`
- 说明: 启用后会优先使用本地音频，如果本地不存在则回退到在线 API

**`qwerty-learner.downloadVoiceTypes`**
- 类型: `array`
- 默认值: `["us"]`
- 可选值: `["us"]`, `["uk"]`, `["us", "uk"]`
- 说明: 下载音频时包含的发音类型

### 配置示例

```json
{
  "qwerty-learner.useLocalAudio": true,
  "qwerty-learner.downloadVoiceTypes": ["us", "uk"],
  "qwerty-learner.voiceType": "us"
}
```

## 使用步骤

### 1. 下载词典音频

1. 打开命令面板（Mac: `Cmd+Shift+P`，Windows: `Ctrl+Shift+P`）
2. 输入 `Qwerty Learner Download Dictionary Audios`
3. 选择当前词典，确认下载
4. 等待下载完成（会显示进度）

### 2. 查看音频状态

1. 打开命令面板
2. 输入 `Qwerty Learner Check Audio Status`
3. 查看当前词典的音频下载情况：
   - 总文件数
   - 已下载数量
   - 完成度
   - 存储占用

### 3. 清理音频文件

1. 打开命令面板
2. 输入 `Qwerty Learner Clean Dictionary Audios`
3. 确认删除当前词典的本地音频

## 命令列表

| 命令 | 说明 |
|------|------|
| `Qwerty Learner Download Dictionary Audios` | 下载当前词典的所有音频 |
| `Qwerty Learner Check Audio Status` | 查看音频下载状态 |
| `Qwerty Learner Clean Dictionary Audios` | 清理当前词典的音频 |

## 存储说明

音频文件存储在插件目录下：
```
qwerty-learner-vscode/
└── assets/
    └── audios/
        ├── cet4/           # CET-4 词典音频
        ├── cet6/           # CET-6 词典音频
        └── ...             # 其他词典音频
```

每个单词的音频文件命名格式：`{单词}_{发音类型}.mp3`
例如：`hello_us.mp3`、`hello_uk.mp3`

## 注意事项

1. **下载时间**：根据词典大小和网络速度，下载可能需要几分钟
2. **存储空间**：每个单词音频约 10-30 KB，完整词典可能占用几十 MB
3. **下载限制**：为避免请求过快，每个音频之间有 100ms 延迟
4. **音频来源**：使用有道词典 API，需要网络连接下载

## 常见问题

### Q: 如何切换使用本地音频？
A: 在设置中修改 `qwerty-learner.useLocalAudio` 为 `true`

### Q: 下载失败怎么办？
A: 检查网络连接，可以重新运行下载命令，已下载的文件会自动跳过

### Q: 如何下载多种发音？
A: 在设置中修改 `qwerty-learner.downloadVoiceTypes` 为 `["us", "uk"]`

### Q: 本地音频会自动更新吗？
A: 不会，需要手动重新下载。建议定期清理后重新下载以获取最新音频

### Q: 可以在不同设备间同步音频吗？
A: 音频文件存储在本地，不支持同步。每个设备需要单独下载

## 反馈与建议

如有问题或建议，欢迎提交 Issue。
