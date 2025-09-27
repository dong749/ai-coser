/**
 * Mock：语音识别/合成
 * - STT：忽略真实音频内容，直接返回占位文本
 * - TTS：返回一个可播放的假音频URL（data URL 占位）
 *
 * 注意：
 * 为避免 ts(6133)/eslint no-unused-vars，我们用 `void text;` 安全“消费”形参。
 */

// 440Hz 哔声，约 0.25 秒，占位用途（不可用作真实音频）
const SILENT_WAV_DATA_URL = 'data:audio/wav;base64,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';

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
