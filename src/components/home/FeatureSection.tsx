import { features } from "../../data/home";

export default function FeatureSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <span className="section-kicker">核心优势</span>
          <h2>先把最重要的信息讲明白</h2>
          <p>宣传页不需要很长，把用户真正关心的内容放前面就够了。</p>
        </div>

        <div className="card-grid">
          {features.map((feature) => (
            <article key={feature.title} className="content-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
