/**
 * voice.contract.js
 * 前后端契约（Contract）——语音识别/语音合成
 *
 * 后端同学请注意（接口约定）：
 * 1) 语音识别（STT）
 *    - POST /api/v1/voice/stt
 *    - Content-Type: multipart/form-data
 *    - FormData: file(必填), language?(可选)
 *    - Response: { "text": "识别结果" }
 *
 * 2) 语音合成（TTS）
 *    - POST /api/v1/voice/tts
 *    - JSON: { "text": "...", "voiceId": "female_en" }
 *    - Response: { "audioUrl": "https://..." } 或 { "audioBase64": "data:..." }
 *
 * 统一错误结构（建议）：{ error: { code, message } }
 *
 * 说明：本文件函数仅用于“契约占位”，运行时请使用 services/index.js 的实现。
 */

/**
 * @param {{ file: File, language?: string }} payload
 * @returns {Promise<{ text: string }>}
 */
export async function speechToText(payload) {
  void payload;
  throw new Error('[Contract Stub] 请从 services/index.js 导入实现（mock 或 api）。');
}

/**
 * @param {{ text: string, voiceId?: string }} payload
 * @returns {Promise<{ audioUrl?: string, audioBase64?: string }>}
 */
export async function textToSpeech(payload) {
  void payload;
  throw new Error('[Contract Stub] 请从 services/index.js 导入实现（mock 或 api）。');
}
