import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Characters } from '../../services';
import ChatPanel from '../../components/chat/ChatPanel.jsx';
import './CharacterPage.css';

export default function CharacterPage() {
    const { id } = useParams();
    const loc = useLocation();

    // 如果从上页传了对象，直接用，减少一次请求
    const preloaded = loc.state?.character;
    const [c, setC] = useState(preloaded || null);
    const [loading, setLoading] = useState(!preloaded);

    useEffect(() => {
        let alive = true;
        if (preloaded) return;
        (async () => {
            try {
                setLoading(true);
                const data = await Characters.getCharacterById(id);
                if (!alive) return;
                setC(data);
            } catch (e) {
                console.error('[CharacterPage] getCharacterById error:', e);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [id, preloaded]);

    if (loading) {
        return (
            <main className="character-page">
                <section className="char-hero loading">
                    <div className="avatar-skeleton" />
                    <div className="text-skeleton" />
                    <div className="text-skeleton narrow" />
                </section>
            </main>
        );
    }

    if (!c) {
        return (
            <main className="character-page">
                <section className="char-hero">
                    <p className="muted">未找到角色。</p>
                    <Link to="/search" className="btn">返回搜索</Link>
                </section>
            </main>
        );
    }

    return (
        <main className="character-page">
            <section className="char-hero">
                <div className="char-meta">
                    <img className="char-avatar" src={c.avatar} alt={c.name} />
                    <div className="meta-right">
                        <h1 className="char-name">{c.name}</h1>
                        <p className="char-desc">{c.description}</p>
                        <div className="char-tags">
                            {(c.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
                        </div>
                        <div className="char-skills">
                            {(c.skills || []).map(s => <span key={s} className="skill">{s}</span>)}
                        </div>
                        <div className="char-actions">
                            <a href="#chat" className="btn btn-primary">开始对话</a>
                            <Link to="/voice-settings" className="btn">语音设置</Link>
                        </div>
                    </div>
                </div>
            </section>

            <section id="chat" className="char-chat">
                <ChatPanel character={c} />
            </section>
        </main>
    );
}
