# 本地音频功能 - 快速开始

## 🚀 5分钟上手指南

### 第一步：编译和安装

```bash
cd qwerty-learner-vscode
yarn install
yarn compile
```

### 第二步：启动调试

在 VSCode 中按 `F5` 启动插件调试模式

### 第三步：配置音频选项

在新打开的 VSCode 窗口中：

1. 打开设置（Mac: `Cmd+,` / Windows: `Ctrl+,`）
2. 搜索 `qwerty-learner`
3. 配置以下选项：

```json
{
  // 启用本地音频
  "qwerty-learner.useLocalAudio": true,
  
  // 选择要下载的发音类型（美音、英音或两者都要）
  "qwerty-learner.downloadVoiceTypes": ["us"],
  
  // 发音类型设置（播放时使用）
  "qwerty-learner.voiceType": "us"
}
```

### 第四步：下载音频

1. 打开命令面板（Mac: `Cmd+Shift+P` / Windows: `Ctrl+Shift+P`）
2. 输入 `Qwerty Learner Download Dictionary Audios`
3. 确认下载
4. 等待下载完成（约1-3分钟，取决于词典大小）

### 第五步：开始使用

1. 在任意文档按快捷键启动（Mac: `Ctrl+Shift+Q` / Windows: `Shift+Alt+Q`）
2. 开始打字练习
3. 音频会自动从本地播放，无需网络！

## 💡 常用命令

| 命令 | 快捷键 | 说明 |
|------|--------|------|
| Start/Pause | `Ctrl+Shift+Q` (Mac)<br>`Shift+Alt+Q` (Win) | 开始/暂停练习 |
| Download Dictionary Audios | - | 下载当前词典音频 |
| Check Audio Status | - | 查看下载状态 |
| Change Dictionary | - | 切换词典 |

## 📊 功能测试检查清单

- [ ] 编译成功无错误
- [ ] 能够正常启动插件
- [ ] 配置选项可以正常修改
- [ ] 下载命令可以执行
- [ ] 下载进度正常显示
- [ ] 音频文件保存在 `assets/audios/` 目录
- [ ] 播放音频时使用本地文件
- [ ] 查看状态命令显示正确信息
- [ ] 清理命令可以删除音频文件

## 🔧 故障排除

### 问题1：下载失败
**解决方案：**
- 检查网络连接
- 确认可以访问 dict.youdao.com
- 重新运行下载命令（已下载的会自动跳过）

### 问题2：音频播放无声音
**解决方案：**
- 检查 `qwerty-learner.voiceType` 不是 `"close"`
- 确认已下载对应发音类型的音频
- 检查音频文件是否存在于 `assets/audios/{dict-id}/` 目录

### 问题3：占用存储空间太大
**解决方案：**
- 使用 `Clean Dictionary Audios` 清理不需要的词典
- 只下载单一发音类型（如只选 `["us"]`）

## 📝 开发说明

### 项目结构

```
qwerty-learner-vscode/
├── src/
│   ├── utils/
│   │   └── AudioManager.ts      # 音频管理器
│   ├── resource/
│   │   └── voice/
│   │       └── index.ts          # 音频播放逻辑
│   └── index.ts                  # 主入口（注册命令）
├── assets/
│   └── audios/                   # 本地音频存储
│       ├── cet4/
│       ├── cet6/
│       └── ...
└── AUDIO_FEATURE.md              # 详细文档
```

### 核心类

**AudioManager**
- `downloadAudio()` - 下载单个音频
- `downloadDictionaryAudios()` - 批量下载
- `hasLocalAudio()` - 检查本地是否有音频
- `getLocalAudioPath()` - 获取本地路径
- `getDictionaryAudioStats()` - 获取统计信息
- `cleanDictionaryAudios()` - 清理音频

### API说明

**有道词典音频API**
```
https://dict.youdao.com/dictvoice?audio={word}&type={type}
```
- `word`: 单词
- `type`: 1=英音, 2=美音

## 🎯 下一步计划

可选的改进方向：
- [ ] 支持离线词典（整体打包）
- [ ] 添加音频预加载功能
- [ ] 支持自定义音频源
- [ ] 添加音频缓存策略
- [ ] 支持批量导入音频

## 📚 更多资源

- [完整文档](AUDIO_FEATURE.md)
- [原项目](https://github.com/Kaiyiwing/qwerty-learner)
- [VSCode插件开发文档](https://code.visualstudio.com/api)

---

Happy Coding! 🎉
