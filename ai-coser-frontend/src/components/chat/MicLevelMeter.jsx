import './MicLevelMeter.css';

export default function MicLevelMeter({ level = 0, active = false }) {
    return (
        <div className={`mlm ${active ? 'on' : ''}`} aria-label="麦克风输入电平">
            <div className="mlm-bar" style={{ transform: `scaleX(${Math.max(0.05, Math.min(1, level))})` }} />
        </div>
    );
}
