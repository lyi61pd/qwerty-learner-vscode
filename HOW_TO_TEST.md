# 如何测试本地音频功能

## 第一步：启动开发环境

### 1. 在 VSCode 中打开项目
```bash
cd /Users/ybbj100324/code/qwerty-learner-vscode
code .
```

### 2. 按 F5 启动调试
- 在 VSCode 中按 `F5` 键
- 或者点击菜单：Run → Start Debugging
- 这会打开一个新的 VSCode 窗口（Extension Development Host）

💡 **提示**：新窗口的标题栏会显示 `[Extension Development Host]`

---

## 第二步：配置本地音频

### 1. 打开设置
在新窗口中：
- Mac: `Cmd + ,`
- Windows: `Ctrl + ,`

### 2. 搜索并配置
搜索 `qwerty-learner`，设置以下选项：

```json
{
  // 启用本地音频（必须）
  "qwerty-learner.useLocalAudio": true,
  
  // 选择要下载的发音类型
  "qwerty-learner.downloadVoiceTypes": ["us"],
  
  // 设置播放时使用的发音
  "qwerty-learner.voiceType": "us"
}
```

**或者直接编辑 settings.json：**
1. `Cmd/Ctrl + Shift + P` 打开命令面板
2. 输入 `Preferences: Open User Settings (JSON)`
3. 添加上述配置

---

## 第三步：下载音频

### 1. 打开命令面板
- Mac: `Cmd + Shift + P`
- Windows: `Ctrl + Shift + P`

### 2. 输入命令
输入：`Qwerty Learner Download Dictionary Audios`

### 3. 确认下载
会显示一个对话框，告诉你：
- 当前词典名称（默认是 CET-4）
- 要下载的文件数量
- 已下载的数量

点击 **"开始下载"**

### 4. 等待完成
会显示下载进度，例如：
```
下载 CET-4 音频
45% - 正在下载: hello
```

通常需要 **2-5 分钟**（取决于词典大小）

---

## 第四步：测试功能

### 方法1：启动练习测试

1. **打开任意文件**
   - 新建一个文本文件或打开已有文件

2. **启动练习**
   - Mac: `Ctrl + Shift + Q`
   - Windows: `Shift + Alt + Q`

3. **观察状态栏**
   - 底部状态栏会显示单词
   - 应该会听到单词发音（本地播放）

4. **开始打字**
   - 关闭中文输入法
   - 按照显示的单词打字

### 方法2：检查音频状态

1. 打开命令面板 (`Cmd/Ctrl + Shift + P`)
2. 输入：`Qwerty Learner Check Audio Status`
3. 会显示：
   ```
   词典: CET-4
   发音类型: us
   总文件数: 2607
   已下载: 2607
   未下载: 0
   完成度: 100%
   存储占用: 52.3 MB
   使用本地音频: 是
   ```

### 方法3：验证音频文件

检查音频文件是否存在：
```bash
ls /Users/ybbj100324/code/qwerty-learner-vscode/assets/audios/cet4/
```

应该看到类似：
```
hello_us.mp3
world_us.mp3
...
```

---

## 常用命令速查

| 命令 | 快捷键 | 功能 |
|------|--------|------|
| Start/Pause | `Ctrl+Shift+Q` (Mac)<br>`Shift+Alt+Q` (Win) | 开始/暂停练习 |
| Change Dictionary | - | 切换词典 |
| Download Dictionary Audios | - | 下载当前词典音频 |
| Check Audio Status | - | 查看下载状态 |
| Clean Dictionary Audios | - | 清理音频文件 |

---

## 测试检查清单

- [ ] 能够按 F5 启动调试
- [ ] 新窗口标题显示 `[Extension Development Host]`
- [ ] 能够在设置中找到 `qwerty-learner` 配置
- [ ] 下载命令可以执行
- [ ] 下载进度正常显示
- [ ] 音频文件保存在 `assets/audios/cet4/` 目录
- [ ] 启动练习后能听到发音
- [ ] Check Audio Status 显示正确信息

---

## 故障排查

### 问题1：按 F5 没反应
**解决方案：**
1. 确保在项目根目录打开了 VSCode
2. 检查是否有 `.vscode/launch.json` 文件
3. 尝试 Run → Start Debugging

### 问题2：找不到命令
**解决方案：**
1. 确保在 Extension Development Host 窗口中操作
2. 重新按 F5 启动
3. 检查编译是否成功：`npm run compile`

### 问题3：下载失败
**解决方案：**
1. 检查网络连接
2. 确认可以访问 dict.youdao.com
3. 查看 VSCode 的 Developer Tools (Help → Toggle Developer Tools)

### 问题4：听不到声音
**解决方案：**
1. 确认 `voiceType` 设置不是 `"close"`
2. 确认已下载对应的音频文件
3. 检查系统音量
4. 查看 Developer Tools 的 Console 是否有错误

### 问题5：编译错误
**解决方案：**
```bash
cd /Users/ybbj100324/code/qwerty-learner-vscode
npm install
npm run compile
```

---

## 完整测试流程（视频教程）

### 1️⃣ 准备（1分钟）
```bash
cd /Users/ybbj100324/code/qwerty-learner-vscode
code .
```

### 2️⃣ 启动（10秒）
按 `F5`，等待新窗口打开

### 3️⃣ 配置（30秒）
1. 在新窗口按 `Cmd/Ctrl + ,`
2. 搜索 `qwerty-learner`
3. 启用 `useLocalAudio`

### 4️⃣ 下载（2-5分钟）
1. `Cmd/Ctrl + Shift + P`
2. 输入 `download`
3. 选择 `Qwerty Learner Download Dictionary Audios`
4. 点击确认，等待完成

### 5️⃣ 测试（30秒）
1. 随便打开或新建一个文件
2. 按 `Ctrl+Shift+Q` (Mac) 或 `Shift+Alt+Q` (Win)
3. 应该能看到状态栏的单词和听到发音
4. 开始打字测试

---

## 下一步

测试成功后，你可以：
- 尝试切换不同的词典
- 下载英音版本（设置 `downloadVoiceTypes: ["us", "uk"]`）
- 清理不需要的音频节省空间
- 关闭本地音频切换回在线模式

---

## 需要帮助？

如果遇到问题：
1. 查看 AUDIO_FEATURE.md 详细文档
2. 查看 Developer Tools 的 Console
3. 检查音频文件是否存在
4. 确认配置是否正确

祝你测试顺利！🎉
