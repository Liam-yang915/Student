import { steps } from "../../data/home";

export default function StepSection() {
  return (
    <section className="section section-muted">
      <div className="container">
        <div className="section-heading">
          <span className="section-kicker">学习流程</span>
          <h2>页面内容按用户决策顺序来排</h2>
          <p>首页不是把所有内容都堆出来，而是按“理解 - 信任 - 行动”的顺序组织。</p>
        </div>

        <div className="step-list">
          {steps.map((step) => (
            <article key={step.title} className="step-item">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
