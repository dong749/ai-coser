import { useCallback, useEffect, useRef, useState } from 'react';
import { Voice } from '../../services';
import './VoiceSettings.css';

/**
 * 语音设置页
 * - 麦克风设备选择（enumerateDevices）
 * - STT 语言选择
 * - TTS voiceId 选择 + 试听
 * - 麦克风电平测试（按需授权）
 * - 设置持久化到 localStorage
 */
export default function VoiceSettings() {
    const [mics, setMics] = useState([]);
    const [micId, setMicId] = useState(localStorage.getItem('vs.micId') || '');
    const [lang, setLang] = useState(localStorage.getItem('vs.sttLang') || 'auto');
    const [voiceId, setVoiceId] = useState(localStorage.getItem('vs.voiceId') || 'female_en');
    const [testing, setTesting] = useState(false);
    const [level, setLevel] = useState(0);

    const streamRef = useRef(null);
    const rafRef = useRef(0);
    const ctxRef = useRef(null);
    const analyserRef = useRef(null);
    const dataRef = useRef(null);

    // 列出麦克风（固定引用，避免 effect 依赖告警）
    const refreshDevices = useCallback(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const micList = devices.filter(d => d.kind === 'audioinput');
            setMics(micList);
            // 仅当当前没有选择时，才设置为第一个设备
            setMicId(prev => prev || (micList[0]?.deviceId || ''));
        } catch (e) {
            console.error('[VoiceSettings] enumerateDevices error:', e);
        }
    }, []);

    useEffect(() => {
        refreshDevices();
    }, [refreshDevices]);

    // 持久化设置
    useEffect(() => { localStorage.setItem('vs.micId', micId || ''); }, [micId]);
    useEffect(() => { localStorage.setItem('vs.sttLang', lang || ''); }, [lang]);
    useEffect(() => { localStorage.setItem('vs.voiceId', voiceId || ''); }, [voiceId]);

    // 电平测试：启动
    const startTest = async () => {
        if (testing) return;
        setTesting(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: micId ? { deviceId: { exact: micId } } : true,
            });
            streamRef.current = stream;

            const Ctx = window.AudioContext || window.webkitAudioContext;
            const ctx = new Ctx();
            ctxRef.current = ctx;

            const src = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 512;
            analyserRef.current = analyser;
            dataRef.current = new Uint8Array(analyser.frequencyBinCount);
            src.connect(analyser);

            const loop = () => {
                analyser.getByteTimeDomainData(dataRef.current);
                let sum = 0;
                for (let i = 0; i < dataRef.current.length; i++) {
                    const v = (dataRef.current[i] - 128) / 128;
                    sum += v * v;
                }
                const rms = Math.sqrt(sum / dataRef.current.length);
                setLevel(Math.min(1, rms * 4));
                rafRef.current = requestAnimationFrame(loop);
            };
            loop();
        } catch (e) {
            console.error('[VoiceSettings] getUserMedia error:', e);
            setTesting(false);
        }
    };

    // 电平测试：停止 & 清理
    const stopTest = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;

        const ctx = ctxRef.current;
        if (ctx && typeof ctx.close === 'function') {
            ctx.close().catch((e) => { void e; });
        }
        ctxRef.current = null;

        const stream = streamRef.current;
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }

        analyserRef.current = null;
        dataRef.current = null;
        setTesting(false);
        setLevel(0);
    };

    useEffect(() => () => stopTest(), []);

    // 试听 TTS
    const tryTTS = async () => {
        try {
            const res = await Voice.textToSpeech({ text: '这是一段语音合成试听。', voiceId });
            const url = res.audioUrl || res.audioBase64;
            if (url) {
                const audio = new Audio(url);
                await audio.play().catch((e) => { void e; });
            }
        } catch (e) {
            console.error('[VoiceSettings] TTS error:', e);
        }
    };

    return (
        <main className="voice-settings">
            <section className="vs-inner">
                <h1>语音设置</h1>
                <p className="muted">选择麦克风、STT 语言、TTS 声音，并测试输入电平与合成效果。</p>

                <div className="grid">
                    {/* 麦克风卡片 */}
                    <div className="card">
                        <h2>麦克风</h2>
                        <div className="row">
                            <label>输入设备</label>
                            <select value={micId} onChange={(e) => setMicId(e.target.value)}>
                                {mics.map((m) => (
                                    <option key={m.deviceId || m.label} value={m.deviceId || ''}>
                                        {m.label || '麦克风'}
                                    </option>
                                ))}
                            </select>
                            <button className="ghost" onClick={refreshDevices}>刷新</button>
                        </div>

                        <div className="row">
                            <label>电平测试</label>
                            <div className="level-wrap" aria-label="麦克风输入电平">
                                <div
                                    className="level-bar"
                                    style={{ transform: `scaleX(${Math.max(0.05, level)})` }}
                                />
                            </div>
                            {!testing ? (
                                <button onClick={startTest}>开始测试</button>
                            ) : (
                                <button onClick={stopTest}>停止</button>
                            )}
                        </div>
                    </div>

                    {/* STT 语言卡片 */}
                    <div className="card">
                        <h2>STT 语言</h2>
                        <div className="row">
                            <label>识别语言</label>
                            <select value={lang} onChange={(e) => setLang(e.target.value)}>
                                <option value="auto">自动识别</option>
                                <option value="zh">中文</option>
                                <option value="en">English</option>
                                <option value="ja">日本語</option>
                            </select>
                        </div>
                    </div>

                    {/* TTS 声音卡片 */}
                    <div className="card">
                        <h2>TTS 声音</h2>
                        <div className="row">
                            <label>Voice ID</label>
                            <select value={voiceId} onChange={(e) => setVoiceId(e.target.value)}>
                                <option value="female_en">female_en</option>
                                <option value="male_en">male_en</option>
                                <option value="female_zh">female_zh</option>
                            </select>
                            <button onClick={tryTTS}>试听</button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
