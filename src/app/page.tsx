"use client";

import HeroCarousel from "@/components/HeroCarousel";
import HowItWorks from "@/components/HowItWorks";
import HomeCooksCarousel from "@/components/HomeCooksCarousel";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import { FadeInUp } from "@/components/AnimatedSection";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <FadeInUp><HowItWorks /></FadeInUp>
      <FadeInUp><HomeCooksCarousel /></FadeInUp>
      <FadeInUp><StatsSection /></FadeInUp>
      <FadeInUp><TestimonialsSection /></FadeInUp>
      <FadeInUp><CTASection /></FadeInUp>
    </>
  );
}
