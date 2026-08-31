import ScrollReveal from "@/components/animations/ScrollReveal";
import Navbar from "@/components/layout/navbar";
import AboutSection from "@/features/homepage/about-section";
import HeroSection from "@/features/homepage/hero-section";
import PrinciplesSection from "@/features/homepage/principles-section";
import WorkSection from "@/features/homepage/work-section";
import ContactSection from "@/features/homepage/contact-section";

export default function HomePage() {
  return (
    <main className="bg-black text-white">
      <Navbar />
      <ScrollReveal>
        <HeroSection />
      </ScrollReveal>

      <ScrollReveal>
        <PrinciplesSection />
      </ScrollReveal>

      <WorkSection />

      <AboutSection />

      <ContactSection />
    </main>
  );
}
