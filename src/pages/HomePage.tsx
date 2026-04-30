import HeroSection from "../components/home/HeroSection";
import FeatureSection from "../components/home/FeatureSection";
import StepSection from "../components/home/StepSection";
import CtaSection from "../components/home/CtaSection";

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="home-header">
        <div className="container home-header-inner">
          <a href="#/" className="brand-mark">
            English Learning
          </a>
          <a href="#/login" className="button button-secondary">
            学生登录
          </a>
        </div>
      </header>

      <HeroSection />
      <FeatureSection />
      <StepSection />
      <CtaSection />
    </main>
  );
}
