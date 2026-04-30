import { ctaContent } from "../../data/home";

export default function CtaSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-box">
          <div>
            <span className="section-kicker">下一步</span>
            <h2>{ctaContent.title}</h2>
            <p>{ctaContent.description}</p>
          </div>
          <button type="button" className="button button-primary">
            {ctaContent.action}
          </button>
        </div>
      </div>
    </section>
  );
}
