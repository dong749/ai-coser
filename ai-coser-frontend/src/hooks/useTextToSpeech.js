import { Voice } from '../services';

export function useTextToSpeech() {
  /**
   * 合成文本并可选自动播放
   * @param {string} text
   * @param {{ voiceId?: string, autoplay?: boolean }} [opts]
   * @returns {Promise<{ audioUrl?: string, audioBase64?: string, play: ()=>Promise<void> }>}
   */
  async function synthesize(text, opts = {}) {
    const { voiceId, autoplay } = opts;
    const res = await Voice.textToSpeech({ text, voiceId });

    const url = res.audioUrl || res.audioBase64;
    const audio = url ? new Audio(url) : null;

    async function play() {
      if (!audio) return;
      try { await audio.play(); } catch { /* 可能被浏览器阻止 */ }
    }

    if (autoplay) await play();

    return { ...res, play };
  }

  return { synthesize };
}
