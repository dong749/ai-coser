/**
 * 真实接口实现（占位）：STT/TTS
 * 与后端约定见 contracts/voice.contract.js
 */
import { http } from './http.js';

export function speechToText({ file, language }) {
  const form = new FormData();
  form.append('file', file);
  if (language) form.append('language', language);
  return http.post('/voice/stt', form);
}

export function textToSpeech({ text, voiceId }) {
  return http.post('/voice/tts', { text, voiceId });
}
