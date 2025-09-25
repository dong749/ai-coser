import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">RolePlay</Link>
        <nav className="nav-links">
          <Link to="/">Discover</Link>
          <a href="#grid" onClick={(e)=>e.preventDefault() || document.getElementById("grid")?.scrollIntoView({behavior:"smooth"})}>
            Characters
          </a>
          <Link to="/settings/voice">Voice</Link>
        </nav>
      </div>
    </header>
  );
}
