/**
 * Mock：聊天（非流式/流式）
 * - 非流式：直接返回完整回复
 * - 流式：使用 ReadableStream + NDJSON 分片模拟
 */

function buildReply({ characterId, lastUserText }) {
  const prefix =
    characterId === 'socrates'
      ? '（苏格拉底）让我反问你：'
      : characterId === 'qinshihuang'
        ? '（嬴政）朕倒要问：'
        : '（哈利）我觉得：';
  const content = `${prefix}${lastUserText} 的关键在于……这是一个示例回复，用于前端联调。`;
  return { role: 'assistant', content };
}

export async function sendChat({ characterId, history }) {
  const lastUser = [...history].reverse().find(m => m.role === 'user');
  const reply = buildReply({ characterId, lastUserText: lastUser?.content || '' });
  await new Promise(r => setTimeout(r, 250));
  return { reply, usage: { promptTokens: 42, completionTokens: 73 } };
}

export async function streamChat({ characterId, history }) {
  const lastUser = [...history].reverse().find(m => m.role === 'user');
  const reply = buildReply({ characterId, lastUserText: lastUser?.content || '' }).content;

  // 将回复切成几段，模拟流式
  const chunks = [
    reply.slice(0, 12),
    reply.slice(12, 24),
    reply.slice(24, 48),
    reply.slice(48),
  ].filter(Boolean);

  // 使用 NDJSON （每行一个 JSON）
  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      let i = 0;
      const tick = () => {
        if (i < chunks.length) {
          const line = JSON.stringify({ delta: chunks[i] }) + '\n';
          controller.enqueue(encoder.encode(line));
          i += 1;
          setTimeout(tick, 150);
        } else {
          controller.enqueue(encoder.encode(JSON.stringify({ delta: '', done: true }) + '\n'));
          controller.close();
        }
      };
      setTimeout(tick, 150);
    },
    cancel() { },
  });
}
