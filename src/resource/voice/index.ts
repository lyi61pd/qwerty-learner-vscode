import { VoiceType } from './../../typings/index'
import { getConfig } from '../../utils'
import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'

interface NativeModule {
  playerPlay(voiceUrl: string, callback: () => void): void
}

let NATIVE: any = null

try {
  NATIVE = require(`node-loader!./rodio/mac-arm.node`) as NativeModule
} catch (error) {
  NATIVE = null
}

if (!(NATIVE && NATIVE.playerPlay)) {
  try {
    NATIVE = require(`node-loader!./rodio/win32.node`) as NativeModule
  } catch (error) {
    NATIVE = null
  }
}
if (!(NATIVE && NATIVE.playerPlay)) {
  try {
    NATIVE = require(`node-loader!./rodio/mac-intel.node`) as NativeModule
  } catch (error) {
    NATIVE = null
  }
}
if (!(NATIVE && NATIVE.playerPlay)) {
  try {
    NATIVE = require(`node-loader!./rodio/linux-x64.node`) as NativeModule
  } catch (error) {
    NATIVE = null
  }
}
if (!(NATIVE && NATIVE.playerPlay)) {
  NATIVE = null
}

let extensionContext: vscode.ExtensionContext | null = null

export const setVoiceContext = (context: vscode.ExtensionContext) => {
  extensionContext = context
}

/**
 * 获取本地音频路径
 */
const getLocalAudioPath = (dictId: string, word: string, voiceType: 'us' | 'uk'): string | null => {
  if (!extensionContext) {
    return null
  }
  const audioBaseDir = path.join(extensionContext.extensionPath, 'assets', 'audios')
  const dictDir = path.join(audioBaseDir, dictId)
  const fileName = `${word}_${voiceType}.mp3`
  const audioPath = path.join(dictDir, fileName)
  
  if (fs.existsSync(audioPath)) {
    return audioPath
  }
  return null
}

/**
 * 获取有道API音频URL
 */
const getYoudaoAudioUrl = (word: string, voiceType: 'us' | 'uk'): string => {
  const type = voiceType === 'us' ? 2 : 1
  return `https://dict.youdao.com/dictvoice?audio=${word}&type=${type}`
}

export const voicePlayer = (word: string, callback: () => void, dictId?: string) => {
  console.log("[Voice] voicePlayer called for word:", word)
  
  // 如果 NATIVE 模块不可用，立即执行回调
  if (!NATIVE) {
    console.log("[Voice] NATIVE module not available, skipping playback")
    callback()
    return
  }

  const voiceType = getConfig('voiceType') === 'us' ? 'us' : 'uk'
  const useLocalAudio = getConfig('useLocalAudio')
  
  let audioUrl: string

  // 如果启用本地音频且提供了词典ID，先尝试使用本地音频
  if (useLocalAudio && dictId) {
    const localPath = getLocalAudioPath(dictId, word, voiceType)
    if (localPath) {
      // 直接使用本地文件路径（新的 native module 支持本地文件）
      audioUrl = localPath
      console.log(`[Voice] Using local audio: ${audioUrl}`)
    } else {
      // 本地没有，使用在线API
      audioUrl = getYoudaoAudioUrl(word, voiceType)
      console.log(`[Voice] Local audio not found, using online: ${audioUrl}`)
    }
  } else {
    // 使用在线API
    audioUrl = getYoudaoAudioUrl(word, voiceType)
    console.log(`[Voice] Using online audio: ${audioUrl}`)
  }

  try {
    console.log("[Voice] Calling NATIVE.playerPlay with URL:", audioUrl)
    
    // 设置超时保险机制，防止回调永远不被调用
    const timeoutId = setTimeout(() => {
      console.log("[Voice] Playback timeout, forcing callback")
      callback()
    }, 10000) // 10秒超时
    
    // 包装回调，确保只执行一次
    let callbackCalled = false
    const wrappedCallback = () => {
      if (!callbackCalled) {
        callbackCalled = true
        clearTimeout(timeoutId)
        console.log("[Voice] Playback finished, callback executed")
        callback()
      }
    }
    
    NATIVE.playerPlay(audioUrl, wrappedCallback)
  } catch (error) {
    console.error("[Voice] Error playing audio:", error)
    // 发生错误时也要执行回调，释放锁
    callback()
  }
}
