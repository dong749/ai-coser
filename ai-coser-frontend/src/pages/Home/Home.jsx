import "./Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="home dark">
      {/* HERO */}
      <div className="home-hero">
        <p className="welcome">Welcome, friend</p>
        <h1 className="title">What are you in the mood for?</h1>

        <div className="searchbar">
          <span className="search-ic">🔎</span>
          <input
            placeholder="Try: Corporate vampire / 哈利波特 / 苏格拉底 ..."
            aria-label="Search characters"
          />
          <kbd className="shortcut">Ctrl</kbd>
          <span className="slash">/</span>
        </div>

        <div className="chips">
          <button className="chip is-active">Trending</button>
          <button className="chip">Magic</button>
          <button className="chip">Philosophy</button>
          <button className="chip">Detective</button>
        </div>
      </div>

      {/* GRID – only 3 cards */}
      <div className="home-grid" id="grid">
        <CharacterCard
          id="harry"
          name="哈利·波特"
          subtitle="年轻巫师，讲述友情与勇气。"
          color="#0e8bd6"
          to="/character/harry"
        />
        <CharacterCard
          id="socrates"
          name="苏格拉底"
          subtitle="通过提问启发思考的哲学家。"
          color="#c03b73"
          to="/character/socrates"
        />
        <CharacterCard
          id="sherlock"
          name="福尔摩斯"
          subtitle="演绎法侦探，擅长观察与推理。"
          color="#8b5cf6"
          to="/character/sherlock"
        />
      </div>
    </section>
  );
}

function CharacterCard({ name, subtitle, color, to }) {
  return (
    <Link to={to} className="card" style={{ "--card": color }}>
      <div className="card-art" aria-hidden />
      <div className="card-body">
        <div className="card-title">{name}</div>
        <div className="card-sub">{subtitle}</div>
      </div>
      <button className="card-cta" onClick={(e)=>{e.preventDefault();}}>
        Start chat
      </button>
    </Link>
  );
}
