import { heroContent } from "../../data/home";

export default function HeroSection() {
  return (
    <section className="hero section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">{heroContent.badge}</span>
          <h1>{heroContent.title}</h1>
          <p>{heroContent.description}</p>
          <div className="hero-actions">
            <button type="button" className="button button-primary">
              {heroContent.primaryAction}
            </button>
            <button type="button" className="button button-secondary">
              {heroContent.secondaryAction}
            </button>
          </div>
        </div>

        <div className="hero-card">
          <p className="hero-card-label">学生端首页建议</p>
          <ul className="hero-points">
            <li>首屏先讲价值</li>
            <li>中间放 3 个核心优势</li>
            <li>再补一个清晰流程</li>
            <li>最后只保留一个转化按钮</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
