import { Link } from 'react-router-dom';
import './CharacterCard.css';

export default function CharacterCard({ c }) {
  return (
    <article className="char-card">
      <div className="char-head">
        <img src={c.avatar} alt={c.name} className="char-avatar" />
        <div className="char-meta">
          <h3 className="char-name">{c.name}</h3>
        </div>
      </div>
      <p className="char-desc">{c.description}</p>
      <div className="char-skills">
        {(c.skills || []).slice(0, 4).map(s => (
          <span key={s} className="char-skill">{s}</span>
        ))}
      </div>
      <div className="char-actions">
        <Link className="ghost" to={`/character/${c.id}`}>了解更多</Link>
        <Link className="primary" to={`/character/${c.id}`}>开始对话</Link>
      </div>
    </article>
  );
}
