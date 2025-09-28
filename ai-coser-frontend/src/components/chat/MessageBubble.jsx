import './MessageBubble.css';

export default function MessageBubble({ role, content }) {
    // 只支持 user / assistant 两种渲染
    const cls = role === 'user' ? 'user' : 'assistant';
    return <div className={`bubble ${cls}`}>{content}</div>;
}
