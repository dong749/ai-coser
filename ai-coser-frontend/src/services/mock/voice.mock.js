/**
 * Mock：语音识别/合成
 * - STT：忽略真实音频内容，直接返回占位文本
 * - TTS：返回一个可播放的假音频URL（data URL 占位）
 *
 * 注意：
 * 为避免 ts(6133)/eslint no-unused-vars，我们用 `void text;` 安全“消费”形参。
 */

// 简单“静音”WAV DataURL，占位用途（不可用作真实音频）
const SILENT_WAV_DATA_URL =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=';

export async function speechToText({ file, language }) {
  // 真实实现由后端调用 ASR 引擎产生
  await new Promise(r => setTimeout(r, 200));
  return { text: `（Mock识别结果 ${language || 'auto'}）我听到了 ${file?.name || 'audio'}。` };
}

export async function textToSpeech({ text, voiceId }) {
  // 用 void “消费”参数，既不改变返回结构，也能通过 TS/ESLint 检查
  void text;

  await new Promise(r => setTimeout(r, 150));
  return { audioUrl: SILENT_WAV_DATA_URL, voiceId: voiceId || 'mock-voice' };
}
