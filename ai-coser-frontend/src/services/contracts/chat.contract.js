/**
 * chat.contract.js
 * 前后端契约（Contract）——文本聊天（非流式/流式）
 *
 * 后端同学请注意（接口约定）：
 * 1) 非流式回复
 *    - Method/Path: POST /api/v1/chat
 *    - Request JSON:
 *        { "characterId": "harry", "history": ChatMessage[] }
 *    - Response JSON:
 *        { "reply": ChatMessage, "usage": { "promptTokens": number, "completionTokens": number } }
 *
 * 2) 流式回复（推荐）
 *    - Method/Path: POST /api/v1/chat/stream
 *    - Headers: Accept: text/event-stream 或 application/x-ndjson
 *    - Request JSON 同上
 *    - Response（二选一，建议 SSE）：
 *      SSE:  data: {"delta":"..."}\n\n   最后一条包含 {"done":true}
 *      NDJSON: {"delta":"..."}\n        最后一行包含 {"done":true}
 *
 * 统一错误结构（建议）：
 *    4xx/5xx: { error: { code: string, message: string } }
 *
 * 说明：本文件函数仅用于“契约占位”，运行时请使用 services/index.js 的实现。
 */

/**
 * @typedef {Object} ChatMessage
 * @property {"user"|"assistant"|"system"} role
 * @property {string} content
 * @property {string=} audioUrl // 可选：后端也可返回TTS音频地址
 */

/**
 * 非流式聊天
 * @param {{ characterId: string, history: ChatMessage[] }} payload
 * @returns {Promise<{ reply: ChatMessage, usage?: { promptTokens: number, completionTokens: number } }>}
 */
export async function sendChat(payload) {
  void payload;
  throw new Error('[Contract Stub] 请从 services/index.js 导入实现（mock 或 api）。');
}

/**
 * 流式聊天（返回 ReadableStream，前端自行解码）
 * @param {{ characterId: string, history: ChatMessage[] }} payload
 * @returns {Promise<ReadableStream<Uint8Array>>}
 */
export async function streamChat(payload) {
  void payload;
  throw new Error('[Contract Stub] 请从 services/index.js 导入实现（mock 或 api）。');
}
