import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Characters } from '../../services';
import CharacterCard from '../../components/cards/CharacterCard.jsx';
import './Search.css';

export default function Search() {
    const [sp, setSp] = useSearchParams();
    const qFromUrl = sp.get('q') || '';
    const [q, setQ] = useState(qFromUrl);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

    const run = async (keyword) => {
        setLoading(true);
        try {
            const res = await Characters.searchCharacters({ q: keyword });
            setList(res?.list || []);
            setSp(keyword ? { q: keyword } : {});
        } catch (e) {
            console.error('[Search] searchCharacters error:', e);
            setList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { run(qFromUrl); /* eslint-disable-line react-hooks/exhaustive-deps */ }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        run(q.trim());
    };

    return (
        <main className="search">
            <section className="search-head">
                <h1>搜索角色</h1>
                <form className="search-bar" onSubmit={onSubmit}>
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="输入关键字：如 harry / 苏格拉底 / 秦始皇"
                        aria-label="搜索关键字"
                    />
                    <button type="submit" disabled={loading}>{loading ? '搜索中…' : '搜索'}</button>
                </form>
                <p className="hint">后端未就绪时，本页使用 mock 数据。</p>
            </section>

            <section className="search-results">
                {loading ? (
                    <div className="skeleton-grid">
                        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" />)}
                    </div>
                ) : list.length ? (
                    <div className="grid-3">
                        {list.map((c) => <CharacterCard key={c.id} c={c} />)}
                    </div>
                ) : (
                    <div className="empty">没有找到匹配的角色。</div>
                )}
            </section>
        </main>
    );
}
