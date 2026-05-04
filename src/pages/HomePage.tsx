import { useState, useEffect } from "react";
import HeroSection from "../components/home/HeroSection";
import FeatureSection from "../components/home/FeatureSection";
import StepSection from "../components/home/StepSection";
import CtaSection from "../components/home/CtaSection";
import { authService } from "../services/api";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  return (
    <main className="page-shell">
      <header className="home-header">
        <div className="container home-header-inner">
          <a href="#/" className="brand-mark">
            English Learning
          </a>
          <a
            href={isAuthenticated ? "#/profile" : "#/login"}
            className="button button-secondary"
          >
            {isAuthenticated ? "个人中心" : "学生登录"}
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
