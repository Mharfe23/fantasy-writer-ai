
import { useState } from "react";
import { motion } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import MainHero from "@/components/MainHero";
import FeatureSection from "@/components/FeatureSection";
import HowItWorks from "@/components/HowItWorks";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import MainNavigation from "@/components/MainNavigation";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background">
        <div className="relative">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[center_top_1rem] dark:block hidden" />
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          <div className="relative">
            <MainNavigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <MainHero />
            <FeatureSection />
            <HowItWorks />
            <PricingSection />
            <TestimonialsSection />
            <FaqSection />
            <CallToAction />
            <Footer />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
