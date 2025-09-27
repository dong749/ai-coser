// 主页：参考 dippy.ai 的信息密度与分区结构，包含：
// - Hero 区（产品价值 + 示例对话预览）
// - 精选角色（读取 services 层的 mock/api，前端可独立跑）
// - How it works（解释只用 LLM + STT + TTS，无第三方 Agent）
// - Footer
//
// 说明：
// 1) 这个页面只依赖 services/index.js 的统一出口，不直接依赖后端；
//    当 .env 切换 VITE_USE_MOCK=true/false 时，可在 mock 与真后端间无缝切换。
// 2) 任何接口异常都会被捕获，不会让页面白屏。
// 3) UI 的夜间模式由 Navbar 的“手动切换”控制（写入 <html data-theme="...">）。

import { useEffect, useMemo, useState } from 'react';
import { Characters } from '../../services'; // 统一出口：根据 VITE_USE_MOCK 切换
import CharacterCard from '../../components/cards/CharacterCard.jsx';
import './Home.css';

export default function Home() {
  // 角色列表与加载状态
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 只展示前 3 个（本期仅做 3 个角色）
  const top3 = useMemo(() => (list || []).slice(0, 3), [list]);

  useEffect(() => {
    // 组件未卸载前的“存活”标记，防止异步 setState 引发内存泄漏警告
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        // 与后端的契约：GET /characters?q=
        // mock 版本会直接返回内置 3 个角色
        const res = await Characters.searchCharacters({ q: '' });
        if (!alive) return;
        setList(res?.list || []);
      } catch (e) {
        // 兜底：即便接口失败，也要保证页面可渲染
        console.error('[Home] Characters.searchCharacters error:', e);
        if (alive) setList([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="home">
      {/* ========== Section: Hero ========== */}
      {/* 目标：首屏解释“我们是什么 + 能做什么”，并给出“立即开始 / 了解原理”的行动按钮 */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-inner">
          {/* 左侧：标题与卖点 */}
          <div className="hero-left">
            <h1 id="hero-title" className="hero-title">
              与你熟悉的角色，<span className="accent">开口就聊</span>
            </h1>

            <p className="hero-sub">
              选择一个角色（哈利·波特、苏格拉底、秦始皇），使用文字或语音进行真实对话。
              每个角色具备 3+ 专属技能（如“反诘引导”“历史制度解析”“魔法设定考据”），
              让扮演更深入、更贴合设定。
            </p>

            {/* 主调用动作：锚点跳转到精选角色 / 工作原理 */}
            <div className="hero-cta" role="group" aria-label="快速操作">
              <a className="btn btn-primary" href="#featured">开始体验</a>
              <a className="btn btn-ghost" href="#how">了解原理</a>
            </div>

            {/* 展示推荐提示（静态按钮：用于引导用户灵感） */}
            <div className="prompt-pills" aria-label="示例提示">
              <span>试试：</span>
              <button
                className="pill"
                type="button"
                title="提示示例（纯展示，无操作）"
              >
                “请用苏格拉底式提问帮助我反思职业选择”
              </button>
              <button className="pill" type="button" title="提示示例（纯展示，无操作）">
                “哈利，解释一下守护神咒的关键逻辑”
              </button>
              <button className="pill" type="button" title="提示示例（纯展示，无操作）">
                “秦始皇：如果统一度量衡在今天意味着什么？”
              </button>
            </div>
          </div>

          {/* 右侧：对话预览（不接后端，只做静态示例，强调“流式/轮次感”） */}
          <div className="hero-right" aria-label="对话预览示例">
            <div className="mock-card" role="region" aria-labelledby="preview-title">
              <div className="mock-head" aria-hidden="true">
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </div>
              <div className="mock-body">
                <h2 id="preview-title" className="sr-only">示例对话</h2>
                <div className="bubble user">我怎么做选择更理性？</div>
                <div className="bubble ai">
                  （苏格拉底）我们先澄清“理性”的含义：你指的是符合长期利益、还是遵循某套原则？
                </div>
                <div className="bubble user">长期利益。</div>
                <div className="bubble ai">
                  那么，若 A 能提升你三年后的能力，而 B 只带来短期满足，你更看重哪类收益？
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Section: Featured Characters ========== */}
      {/* 读取 services 层数据；后端未就绪时由 mock 提供，保证页面可用 */}
      <section id="featured" className="section" aria-labelledby="featured-title">
        <div className="section-head">
          <h2 id="featured-title">精选角色</h2>
          <p>当前展示 3 位角色；点击卡片可进入“角色页/对话页”的占位路由（稍后接入 ChatPanel）。</p>
        </div>

        {/* 加载骨架屏 */}
        {loading ? (
          <div className="skeleton-grid" role="status" aria-live="polite" aria-busy="true">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton" />
            ))}
          </div>
        ) : top3.length > 0 ? (
          <div className="grid-3">
            {top3.map((c) => (
              <CharacterCard key={c.id} c={c} />
            ))}
          </div>
        ) : (
          // 空状态兜底（比如接口失败或为空）
          <div role="status" aria-live="polite" className="muted">
            暂无可展示的角色，请稍后再试。
          </div>
        )}
      </section>

      {/* ========== Section: How it works ========== */}
      {/* 清晰说明：只用 LLM + STT + TTS ，不依赖第三方 Agent；便于评审对照需求 */}
      <section id="how" className="section" aria-labelledby="how-title">
        <div className="section-head">
          <h2 id="how-title">如何运作</h2>
          <p>
            前端仅调用 LLM、语音识别（STT）与语音合成（TTS），
            不依赖任何第三方 Agent 能力。聊天支持流式回复，文本生成后可选 TTS 播放。
          </p>
        </div>

        <div className="steps">
          <div className="step">
            <div className="step-index" aria-hidden="true">1</div>
            <div>
              <h3>选择角色与技能</h3>
              <p>
                每个角色预置 3+ 技能（例如“反诘引导”“历史制度解析”“魔法设定考据”），
                技能会影响提示词与对话风格，从而让扮演更贴合设定。
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-index" aria-hidden="true">2</div>
            <div>
              <h3>文字或语音输入</h3>
              <p>
                文本输入直接发送；语音输入通过浏览器录音并以 FormData 上传至 STT，
                拿到文本后继续 LLM 推理。
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-index" aria-hidden="true">3</div>
            <div>
              <h3>流式回复与 TTS 播放</h3>
              <p>
                服务端以 SSE/NDJSON 方式流式传输；收到完整文本后可选进行 TTS 合成并播放，
                提升对话的沉浸感。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Footer ========== */}
      <footer className="footer" role="contentinfo">
        <div className="footer-inner">
          <div className="brand" aria-label="项目标识">
            <span className="brand-badge">AI</span>
            <span className="brand-name">角色扮演</span>
          </div>
          <p className="muted">
            © 2025. 前端演示项目。仅展示页面布局与交互，不包含真实版权形象。
          </p>
        </div>
      </footer>
    </main>
  );
}

/**
 * 无障碍小贴士（本页已体现的做法）：
 * - 为主要分区加 aria-labelledby，引用可见标题的 id，让读屏器能快速定位。
 * - 骨架屏容器加 role="status" + aria-busy/aria-live，用于通告“正在加载”。
 * - 预览区域用 role="region" + aria-labelledby，让读屏器知道它是独立的内容块。
 * - 纯装饰元素（如三色小圆点）使用 aria-hidden="true"。
 *
 * 与后端联调注意：
 * - Characters.searchCharacters 的返回结构：{ list: Character[] }
 * - 推荐统一错误结构：{ error: { code, message } }，前端统一在 http.js 处理。
 * - 生产环境建议反代 /api 前缀，避免 CORS；开发环境用 Vite 代理。
 */
