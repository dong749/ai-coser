/**
 * 统一出口：一键切换 mock / api
 * 通过环境变量 VITE_USE_MOCK 控制
 */
const useMock = import.meta.env.VITE_USE_MOCK === 'true';

const Characters = useMock
  ? await import('./mock/characters.mock.js')
  : await import('./api/characters.api.js');

const Chat = useMock
  ? await import('./mock/chat.mock.js')
  : await import('./api/chat.api.js');

const Voice = useMock
  ? await import('./mock/voice.mock.js')
  : await import('./api/voice.api.js');

export { Characters, Chat, Voice };
