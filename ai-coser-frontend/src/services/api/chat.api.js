/**
 * 真实接口实现（占位）：聊天（非流式/流式）
 * 与后端约定见 contracts/chat.contract.js
 */
import { http } from './http.js';

export function sendChat(payload) {
  return http.post('/chat', payload);
}

/**
 * 返回 ReadableStream，用于前端流式解码
 * 后端可用 SSE 或 NDJSON；前端根据 Accept 与服务端实现解码
 */
export async function streamChat(payload) {
  const res = await http.postStream('/chat/stream', payload, {
    headers: { Accept: 'text/event-stream, application/x-ndjson' },
  });
  return res.body; // ReadableStream<Uint8Array>
}
