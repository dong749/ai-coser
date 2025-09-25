import "./Home.css";

export default function Home() {
  return (
    <section className="home">
      <div className="home-hero">
        <h1 className="home-title">AI 角色扮演</h1>
        <p className="home-subtitle">搜索你感兴趣的角色并开始聊天（语音/文本）。</p>
        <div className="home-search">
          <input placeholder="试试：哈利波特、苏格拉底、福尔摩斯…" />
          <button>搜索</button>
        </div>
      </div>

      <div className="home-grid">
        <div className="card">
          <div className="card-title">哈利·波特</div>
          <div className="card-desc">年轻巫师，讲述友情与勇气。</div>
        </div>
        <div className="card">
          <div className="card-title">苏格拉底</div>
          <div className="card-desc">以提问启发思考的哲学家。</div>
        </div>
        <div className="card">
          <div className="card-title">福尔摩斯</div>
          <div className="card-desc">演绎法侦探，擅长观察与推理。</div>
        </div>
      </div>
    </section>
  );
}
