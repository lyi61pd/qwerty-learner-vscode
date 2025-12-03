use neon::prelude::*;
use rodio::{Decoder, OutputStream, Sink};
use std::fs::File;
use std::io::BufReader;
use std::io::Cursor;

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

fn play_audio(url: &str) -> Result<(), Box<dyn std::error::Error>> {
    // 获取音频输出流
    let (_stream, stream_handle) = OutputStream::try_default()?;
    let sink = Sink::try_new(&stream_handle)?;
    
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
    
    // 等待播放完成
    sink.sleep_until_end();
    
    Ok(())
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("playerPlay", player_play)?;
    Ok(())
}
