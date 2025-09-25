// hooks/useChatStream.js
// 统一处理 NDJSON 与 SSE，两种流式都能解析。
// 用法：startStream({ characterId, history, onDelta, onDone, onError, signal })

import { Chat } from '../services';

export function useChatStream() {
  /**
   * @param {{
   *   characterId: string,
   *   history: Array<{role:'user'|'assistant'|'system', content:string}>,
   *   onDelta?: (delta:string, full:string) => void,
   *   onDone?: (full:string) => void,
   *   onError?: (err: any) => void,
   *   signal?: AbortSignal
   * }} opts
   */
  async function startStream(opts) {
    const { characterId, history, onDelta, onDone, onError, signal } = opts || {};
    let full = '';
    let buffer = '';

    try {
      const stream = await Chat.streamChat({ characterId, history });
      const reader = stream.getReader();

      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // 将缓冲区按行拆分，逐行解析（兼容 SSE 与 NDJSON）
        const lines = buffer.split(/\r?\n/);
        // 最后一段可能是不完整的，先保留
        buffer = lines.pop() ?? '';

        for (const raw of lines) {
          const line = raw.trim();
          if (!line) continue;

          let payloadStr = line;

          // 兼容 SSE：行以 "data:" 开头
          if (payloadStr.startsWith('data:')) {
            payloadStr = payloadStr.slice(5).trim();
            if (!payloadStr) continue; // 心跳或空行
          }

          // 解析 JSON（期望 {delta?:string, done?:boolean}）
          try {
            const j = JSON.parse(payloadStr);
            if (typeof j.delta === 'string' && j.delta) {
              full += j.delta;
              onDelta?.(j.delta, full);
            }
            if (j.done) {
              onDone?.(full);
            }
          } catch {
            // 如果不是 JSON，就把整行当作纯文本 delta
            full += payloadStr;
            onDelta?.(payloadStr, full);
          }
        }

        if (signal?.aborted) break;
      }

      // 读完还有尾巴（极端情况）
      if (buffer.trim()) {
        try {
          const j = JSON.parse(buffer.trim());
          if (typeof j.delta === 'string' && j.delta) {
            full += j.delta;
            onDelta?.(j.delta, full);
          }
          if (j.done) onDone?.(full);
        } catch {
          full += buffer.trim();
          onDelta?.(buffer.trim(), full);
          onDone?.(full);
        }
      } else {
        onDone?.(full);
      }
      return full;
    } catch (err) {
      onError?.(err);
      throw err;
    }
  }

  return { startStream };
}
