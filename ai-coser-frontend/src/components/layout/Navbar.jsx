import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">RolePlay</Link>
        <nav className="nav-links">
          <Link to="/">首页</Link>
          <a href="#" onClick={(e) => e.preventDefault()}>发现</a>
          <a href="#" onClick={(e) => e.preventDefault()}>语音设置</a>
        </nav>
      </div>
    </header>
  );
}
