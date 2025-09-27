// 文本输入 + 发送/停止 + 语音录入（自动识别并回填/发送）
import { useState } from 'react';
import AudioRecorderButton from './AudioRecorderButton.jsx';
import MicLevelMeter from './MicLevelMeter.jsx';
import './InputBar.css';

export default function InputBar({ loading, onSend, onStop, onTranscribed }) {
    const [text, setText] = useState('');
    const [recLevel, setRecLevel] = useState(0);
    const [recording, setRecording] = useState(false);

    // Enter 发送
    function onKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!loading && text.trim()) doSend();
        }
    }

    async function doSend() {
        const t = text.trim();
        if (!t) return;
        setText('');
        await onSend?.(t);
    }

    // STT 结果：默认自动发送；如需只回填，改成 setText(res)
    async function handleTranscribed(res) {
        if (!res) return;
        onTranscribed?.(res); // 通知上层（可记录）
        await onSend?.(res);
    }

    return (
        <div className="inputbar">
            <div className="ib-left">
                <AudioRecorderButton
                    onResult={handleTranscribed}
                    onLevel={setRecLevel}
                    onRecordingChange={setRecording}
                />
                <MicLevelMeter level={recLevel} active={recording} />
            </div>

            <textarea
                className="ib-input"
                rows={1}
                placeholder={loading ? '生成中… 点击“停止”中断' : '输入消息，Enter 发送（Shift+Enter 换行）'}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={loading}
            />

            {!loading ? (
                <button className="ib-send" onClick={doSend} disabled={!text.trim()}>
                    发送
                </button>
            ) : (
                <button className="ib-stop" onClick={() => onStop?.()}>
                    停止
                </button>
            )}
        </div>
    );
}
