import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function useTheme() {
  const apply = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
  };
  const init = () => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    apply(saved || (prefersDark ? 'dark' : 'light'));
  };
  const toggle = () => {
    const curr = document.documentElement.getAttribute('data-theme') || 'light';
    apply(curr === 'dark' ? 'light' : 'dark');
  };
  return { init, toggle };
}

export default function Navbar() {
  const { init, toggle } = useTheme();
  const loc = useLocation();

  // 初始化主题（仅首次）
  if (typeof window !== 'undefined') {
    // 只执行一次
    if (!document.documentElement.hasAttribute('data-theme')) init();
  }

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-badge">AI</span>
          <span className="brand-name">角色扮演</span>
        </Link>
        <nav className="nav-links">
          <Link to="/" data-active={loc.pathname === '/'}>首页</Link>
          <Link to="/search" data-active={loc.pathname.startsWith('/search')}>搜索</Link>
        </nav>
        <div className="nav-actions">
          <button className="theme-btn" onClick={toggle} aria-label="切换夜间模式">
            夜间模式
          </button>
        </div>
      </div>
    </header>
  );
}
