// 负责：点击录音 -> 计算输入电平 -> 停止后送 STT -> 返回文本
// 依赖浏览器 MediaRecorder + WebAudio。若不支持，会禁用按钮。
import { useEffect, useRef, useState } from 'react';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import './AudioRecorderButton.css';

const supported = typeof window !== 'undefined' && !!(navigator.mediaDevices && window.MediaRecorder);

export default function AudioRecorderButton({ onResult, onLevel, onRecordingChange }) {
    const { transcribe } = useSpeechToText();
    const [recording, setRecording] = useState(false);

    const mediaRef = useRef(/** @type {MediaRecorder|null} */(null));
    const chunksRef = useRef([]);
    const streamRef = useRef(null);
    const ctxRef = useRef(null);
    const analyserRef = useRef(null);
    const dataRef = useRef(null);
    const rafRef = useRef(0);

    useEffect(() => {
        onRecordingChange?.(recording);
    }, [recording, onRecordingChange]);

    async function start() {
        if (!supported || recording) return;

        try {
            const deviceId = localStorage.getItem('vs.micId') || undefined;
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: deviceId ? { deviceId: { exact: deviceId } } : true,
            });
            streamRef.current = stream;

            // 电平分析
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            ctxRef.current = ctx;
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 512;
            analyserRef.current = analyser;
            dataRef.current = new Uint8Array(analyser.frequencyBinCount);
            source.connect(analyser);

            const tick = () => {
                analyser.getByteTimeDomainData(dataRef.current);
                let sum = 0;
                for (let i = 0; i < dataRef.current.length; i++) {
                    const v = (dataRef.current[i] - 128) / 128;
                    sum += v * v;
                }
                const rms = Math.sqrt(sum / dataRef.current.length);
                onLevel?.(Math.min(1, rms * 4));
                rafRef.current = requestAnimationFrame(tick);
            };
            tick();

            // 录音
            const rec = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
            mediaRef.current = rec;
            chunksRef.current = [];
            rec.ondataavailable = (e) => { if (e.data?.size) chunksRef.current.push(e.data); };
            rec.onstop = handleStopComplete;
            rec.start();

            setRecording(true);
        } catch (e) {
            console.error('[AudioRecorderButton] start error:', e);
            cleanup();
        }
    }

    async function handleStopComplete() {
        try {
            const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
            const file = new File([blob], 'input.webm', { type: 'audio/webm' });

            // 语言（可由 VoiceSettings 设置）
            const language = localStorage.getItem('vs.sttLang') || 'auto';
            const text = await transcribe(file, language);
            if (text) onResult?.(text);
        } catch (e) {
            console.error('[AudioRecorderButton] STT error:', e);
        } finally {
            cleanup();
            setRecording(false);
            onLevel?.(0);
        }
    }

    function cleanup() {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;

        try { ctxRef.current?.close(); } catch (e) { void e; }
        ctxRef.current = null;
        analyserRef.current = null;
        dataRef.current = null;

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        mediaRef.current = null;
        chunksRef.current = [];
    }

    function stop() {
        if (!recording) return;
        try { mediaRef.current?.stop(); } catch (e) { void e; }
    }

    useEffect(() => () => cleanup(), []);

    const label = !supported ? '不支持录音' : (recording ? '停止' : '按住说话');

    return (
        <button
            className="arec"
            type="button"
            disabled={!supported}
            data-recording={recording ? '1' : '0'}
            onMouseDown={start}
            onMouseUp={stop}
            onTouchStart={(e) => { e.preventDefault(); start(); }}
            onTouchEnd={(e) => { e.preventDefault(); stop(); }}
            aria-pressed={recording}
            aria-label="按住说话（松开停止并识别）"
            title="按住说话（松开停止并识别）"
        >
            {label}
        </button>
    );
}
