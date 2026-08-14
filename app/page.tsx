import HeroSection from "@/features/homepage/hero-section";
import PrinciplesSection from "@/features/homepage/principles-section";
import WorkSection from "@/features/homepage/work-section";

export default function HomePage() {
  return (
    <main className="bg-black text-white">
      <HeroSection />
      <PrinciplesSection />
      <WorkSection />
    </main>
  );
}
