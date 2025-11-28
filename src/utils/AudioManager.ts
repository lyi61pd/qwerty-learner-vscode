import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'
import { Word } from '../typings'
import { getConfig } from './index'

export class AudioManager {
  private context: vscode.ExtensionContext
  private audioBaseDir: string

  constructor(context: vscode.ExtensionContext) {
    this.context = context
    this.audioBaseDir = path.join(context.extensionPath, 'assets', 'audios')
    this.ensureAudioDirExists()
  }

  private ensureAudioDirExists() {
    if (!fs.existsSync(this.audioBaseDir)) {
      fs.mkdirSync(this.audioBaseDir, { recursive: true })
    }
  }

  /**
   * 获取本地音频文件路径
   */
  getLocalAudioPath(dictId: string, word: string, voiceType: 'us' | 'uk'): string {
    const dictDir = path.join(this.audioBaseDir, dictId)
    const fileName = `${word}_${voiceType}.mp3`
    return path.join(dictDir, fileName)
  }

  /**
   * 检查本地是否有音频文件
   */
  hasLocalAudio(dictId: string, word: string, voiceType: 'us' | 'uk'): boolean {
    const audioPath = this.getLocalAudioPath(dictId, word, voiceType)
    return fs.existsSync(audioPath)
  }

  /**
   * 获取有道API的音频URL
   */
  getYoudaoAudioUrl(word: string, voiceType: 'us' | 'uk'): string {
    const type = voiceType === 'us' ? 2 : 1
    return `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=${type}`
  }

  /**
   * 下载单个单词的音频
   */
  async downloadAudio(dictId: string, word: string, voiceType: 'us' | 'uk'): Promise<boolean> {
    try {
      const dictDir = path.join(this.audioBaseDir, dictId)
      if (!fs.existsSync(dictDir)) {
        fs.mkdirSync(dictDir, { recursive: true })
      }

      const audioPath = this.getLocalAudioPath(dictId, word, voiceType)
      
      // 如果已存在，跳过
      if (fs.existsSync(audioPath)) {
        return true
      }

      const audioUrl = this.getYoudaoAudioUrl(word, voiceType)
      
      // 使用 https 模块下载
      const https = require('https')
      const response = await new Promise<any>((resolve, reject) => {
        https.get(audioUrl, resolve).on('error', reject)
      })

      if (response.statusCode !== 200) {
        console.error(`Failed to download audio for ${word}: ${response.statusCode}`)
        return false
      }

      // 写入文件
      const fileStream = fs.createWriteStream(audioPath)
      response.pipe(fileStream)

      await new Promise<void>((resolve, reject) => {
        fileStream.on('finish', () => {
          fileStream.close()
          resolve()
        })
        fileStream.on('error', reject)
      })

      return true
    } catch (error) {
      console.error(`Error downloading audio for ${word}:`, error)
      return false
    }
  }

  /**
   * 批量下载词典的所有音频
   */
  async downloadDictionaryAudios(
    dictId: string,
    words: Word[],
    voiceTypes: ('us' | 'uk')[],
    onProgress?: (current: number, total: number, word: string) => void
  ): Promise<{ success: number; failed: number; skipped: number }> {
    const result = { success: 0, failed: 0, skipped: 0 }
    const totalDownloads = words.length * voiceTypes.length

    let currentIndex = 0

    for (const word of words) {
      for (const voiceType of voiceTypes) {
        currentIndex++
        
        if (onProgress) {
          onProgress(currentIndex, totalDownloads, word.name)
        }

        // 检查是否已存在
        if (this.hasLocalAudio(dictId, word.name, voiceType)) {
          result.skipped++
          continue
        }

        const success = await this.downloadAudio(dictId, word.name, voiceType)
        if (success) {
          result.success++
        } else {
          result.failed++
        }

        // 添加延迟避免请求过快
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    return result
  }

  /**
   * 获取词典已下载的音频统计
   */
  getDictionaryAudioStats(dictId: string, words: Word[], voiceTypes: ('us' | 'uk')[]): {
    total: number
    downloaded: number
    missing: number
  } {
    const total = words.length * voiceTypes.length
    let downloaded = 0

    for (const word of words) {
      for (const voiceType of voiceTypes) {
        if (this.hasLocalAudio(dictId, word.name, voiceType)) {
          downloaded++
        }
      }
    }

    return {
      total,
      downloaded,
      missing: total - downloaded,
    }
  }

  /**
   * 清理词典音频
   */
  async cleanDictionaryAudios(dictId: string): Promise<boolean> {
    try {
      const dictDir = path.join(this.audioBaseDir, dictId)
      if (fs.existsSync(dictDir)) {
        // 递归删除目录
        this.deleteFolderRecursive(dictDir)
      }
      return true
    } catch (error) {
      console.error(`Error cleaning dictionary audios:`, error)
      return false
    }
  }

  /**
   * 递归删除目录（兼容旧版 Node.js）
   */
  private deleteFolderRecursive(dirPath: string) {
    if (fs.existsSync(dirPath)) {
      fs.readdirSync(dirPath).forEach((file) => {
        const curPath = path.join(dirPath, file)
        if (fs.lstatSync(curPath).isDirectory()) {
          this.deleteFolderRecursive(curPath)
        } else {
          fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(dirPath)
    }
  }

  /**
   * 获取所有词典的音频目录大小（MB）
   */
  getAudioStorageSize(): number {
    try {
      const getDirectorySize = (dirPath: string): number => {
        let size = 0
        if (!fs.existsSync(dirPath)) {
          return 0
        }
        const files = fs.readdirSync(dirPath)
        for (const file of files) {
          const filePath = path.join(dirPath, file)
          const stats = fs.statSync(filePath)
          if (stats.isDirectory()) {
            size += getDirectorySize(filePath)
          } else {
            size += stats.size
          }
        }
        return size
      }

      const bytes = getDirectorySize(this.audioBaseDir)
      return Math.round((bytes / 1024 / 1024) * 100) / 100 // 保留两位小数
    } catch (error) {
      console.error('Error calculating storage size:', error)
      return 0
    }
  }
}
