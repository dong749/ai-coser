import { Voice } from '../services';

export function useSpeechToText() {
  /**
   * @param {File} file
   * @param {string=} language
   * @returns {Promise<string>} text
   */
  async function transcribe(file, language) {
    const { text } = await Voice.speechToText({ file, language });
    return text || '';
  }
  return { transcribe };
}
