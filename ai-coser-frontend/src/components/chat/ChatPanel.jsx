// components/chat/ChatPanel.jsx
import { useRef, useState } from 'react';
import { useChatStream } from '../../hooks/useChatStream';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import MessageBubble from './MessageBubble.jsx';
import InputBar from './InputBar.jsx';
import './ChatPanel.css';

export default function ChatPanel({ character }) {
  const { startStream } = useChatStream();
  const { synthesize } = useTextToSpeech();

  const [history, setHistory] = useState([
    { role: 'system', content: `You are role-playing as ${character?.name || 'a character'}.` }
  ]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);

  const characterId = character?.id || 'harry';

  function append(msg) {
    setHistory(prev => [...prev, msg]);
  }

  async function handleSend(text) {
    append({ role: 'user', content: text });

    setLoading(true);

    // 预插入空 assistant
    let idx = -1;
    setHistory(prev => {
      const next = [...prev, { role: 'assistant', content: '' }];
      idx = next.length - 1;
      return next;
    });

    const ac = new AbortController();
    abortRef.current = ac;

    try {
      await startStream({
        characterId,
        history: [...history, { role: 'user', content: text }],
        signal: ac.signal,
        onDelta: (delta) => {
          setHistory(prev => {
            const next = [...prev];
            next[idx] = { ...next[idx], content: (next[idx].content || '') + delta };
            return next;
          });
        },
        onDone: async (full) => {
          setLoading(false);
          abortRef.current = null;
          // 自动 TTS（可在 VoiceSettings 选择 voiceId）
          try {
            const voiceId = localStorage.getItem('vs.voiceId') || undefined;
            await synthesize(full, { voiceId, autoplay: false });
          } catch (e) { void e; }
        },
        onError: (e) => {
          console.error('[ChatPanel] stream error:', e);
          setLoading(false);
          abortRef.current = null;
        },
      });
    } catch {
      // 已在 onError 里处理
    }
  }

  function handleStop() {
    abortRef.current?.abort?.();
    abortRef.current = null;
    setLoading(false);
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <img className="avatar" src={character?.avatar} alt={character?.name} />
        <div className="meta">
          <div className="name">{character?.name}</div>
          <div className="desc">{character?.description}</div>
          <div className="skills">
            {(character?.skills || []).map(s => (
              <button key={s} className="skill-btn" onClick={() => handleSend(`使用技能：${s} —— `)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="chat-body">
        {history.filter(m => m.role !== 'system').map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} />
        ))}
      </div>

      <InputBar
        loading={loading}
        onSend={handleSend}
        onStop={handleStop}
        onTranscribed={() => {}}
      />
    </div>
  );
}
