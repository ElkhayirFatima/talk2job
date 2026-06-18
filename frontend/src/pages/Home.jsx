import HeroSection from "../components/home/hero-section";
import TrustSection from "../components/home/trust-section";
import StatsSection from "../components/home/stats-section";
import FeaturesSection from "../components/home/features-section";
import HowItWorksSection from "../components/home/how-it-works-section";
import PlaygroundSection from "../components/home/playground-section";
import DeveloperSection from "../components/home/developer-section";
import TestimonialsSection from "../components/home/testimonials-section";
import FaqSection from "../components/home/faq-section";
import CTASection from "../components/home/cta-section";
import BgGradient from "../components/common/bg-gradient";

export default function Home() {
  return (
    <div className="relative w-full bg-white dark:bg-slate-950">
      <BgGradient />
      <div className="flex flex-col">
        <HeroSection />
        <TrustSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PlaygroundSection />
        <DeveloperSection />
        <TestimonialsSection />
        <FaqSection />
        <CTASection />
      </div>
    </div>
  );
}
