use neon::prelude::*;
use rodio::{Decoder, OutputStream, Sink};
use std::fs::File;
use std::io::BufReader;
use std::io::Cursor;
use std::sync::{Arc, Mutex};
use std::time::Duration;

// 全局共享的 Sink，用于控制音频播放
lazy_static::lazy_static! {
    static ref CURRENT_SINK: Arc<Mutex<Option<Arc<Sink>>>> = Arc::new(Mutex::new(None));
}

fn player_play(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let url = cx.argument::<JsString>(0)?.value(&mut cx);
    let callback = cx.argument::<JsFunction>(1)?.root(&mut cx);
    
    let channel = cx.channel();
    
    // 在新线程中播放音频
    std::thread::spawn(move || {
        // 将错误转换为字符串，使其可以安全地在线程间传递
        let result = play_audio(&url);
        let error_msg = result.err().map(|e| e.to_string());
        
        // 播放完成后调用回调
        channel.send(move |mut cx| {
            let callback = callback.into_inner(&mut cx);
            let this = cx.undefined();
            let args: Vec<Handle<JsValue>> = vec![];
            
            if let Some(msg) = error_msg {
                eprintln!("Audio playback error: {}", msg);
            }
            
            callback.call(&mut cx, this, args)?;
            Ok(())
        });
    });
    
    Ok(cx.undefined())
}

fn player_stop(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    // 清空队列并停止当前正在播放的音频
    if let Ok(mut sink_guard) = CURRENT_SINK.lock() {
        if let Some(sink) = sink_guard.take() {
            sink.clear(); // 清空播放队列
            sink.stop(); // 立即停止
        }
    }
    Ok(cx.undefined())
}

fn play_audio(url: &str) -> Result<(), Box<dyn std::error::Error>> {
    // 先停止之前的播放
    {
        let mut sink_guard = CURRENT_SINK.lock().map_err(|e| format!("Lock error: {}", e))?;
        if let Some(sink) = sink_guard.take() {
            sink.clear();
            sink.stop();
        }
    }
    
    // 创建新的音频系统（stream需要保持存活，所以不能drop）
    let (_stream, stream_handle) = OutputStream::try_default()?;
    let sink = Arc::new(Sink::try_new(&stream_handle)?);
    
    // 判断是本地文件还是网络 URL
    if url.starts_with("file://") {
        // 本地文件
        let file_path = url.strip_prefix("file://").unwrap_or(url);
        let file = File::open(file_path)?;
        let source = Decoder::new(BufReader::new(file))?;
        sink.append(source);
    } else if url.starts_with("http://") || url.starts_with("https://") {
        // 网络 URL
        let response = reqwest::blocking::get(url)?;
        let bytes = response.bytes()?;
        let cursor = Cursor::new(bytes);
        let source = Decoder::new(cursor)?;
        sink.append(source);
    } else {
        // 假设是本地路径（不带 file:// 前缀）
        let file = File::open(url)?;
        let source = Decoder::new(BufReader::new(file))?;
        sink.append(source);
    }
    
    // 克隆sink引用用于轮询检查
    let sink_clone = Arc::clone(&sink);
    
    // 保存到全局变量，以便可以被停止
    {
        let mut sink_guard = CURRENT_SINK.lock().map_err(|e| format!("Lock error: {}", e))?;
        *sink_guard = Some(sink);
    }
    
    // 使用轮询方式检查播放状态，而不是阻塞等待
    loop {
        std::thread::sleep(Duration::from_millis(50));
        
        // 检查sink是否还在全局变量中（如果被清除了说明被停止了）
        {
            let sink_guard = CURRENT_SINK.lock().map_err(|e| format!("Lock error: {}", e))?;
            if sink_guard.is_none() {
                // 被外部停止
                break;
            }
        }
        
        // 检查播放是否完成
        if sink_clone.empty() {
            break;
        }
    }
    
    // 播放完成后清除引用
    {
        let mut sink_guard = CURRENT_SINK.lock().map_err(|e| format!("Lock error: {}", e))?;
        *sink_guard = None;
    }
    
    Ok(())
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("playerPlay", player_play)?;
    cx.export_function("playerStop", player_stop)?;
    Ok(())
}
