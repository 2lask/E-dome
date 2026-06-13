import { LandingNav } from "@/components/landing/landing-nav";
import { Hero } from "@/components/landing/hero";
import { TrustStrip } from "@/components/landing/trust-strip";
import { Personas } from "@/components/landing/personas";
import { FeedShowcase } from "@/components/landing/feed-showcase";
import { YieldCalculator } from "@/components/landing/yield-calculator";
import { NetworkSection } from "@/components/landing/network-3d";
import { BentoGrid } from "@/components/landing/bento-grid";
import { Comparatif } from "@/components/landing/comparatif";
import { Testimonials } from "@/components/landing/testimonials";
import { CtaFinal } from "@/components/landing/cta-final";
import { FooterLanding } from "@/components/landing/footer-landing";
import { SmoothScroll } from "@/components/landing/smooth-scroll";

export default function LandingPage() {
  return (
    <SmoothScroll>
      <LandingNav />
      <main id="main" tabIndex={-1} style={{ outline: "none" }}>
        <Hero />
        <TrustStrip />
        <Personas />
        <FeedShowcase />
        <YieldCalculator />
        <NetworkSection />
        <BentoGrid />
        <Comparatif />
        <Testimonials />
        <CtaFinal />
      </main>
      <FooterLanding />
    </SmoothScroll>
  );
}
