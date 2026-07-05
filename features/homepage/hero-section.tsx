"use client";

import BlurText from "@/components/animation/BlurText";
import Ribbons from "@/components/animation/Ribbons";
import Navbar from "@/components/layout/navbar";
import SplitText from "@/components/animation/SplitText";

const handleAnimationComplete = () => {
  console.log("Animation completed!");
};

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* Ribbons FX */}
      <div className="absolute inset-0 z-10">
        <Ribbons
          baseThickness={30}
          colors={["#E5E5E5"]}
          speedMultiplier={0.5}
          maxAge={500}
          enableFade={false}
          enableShaderEffect={false}
        />
      </div>

      {/* Navbar */}
      <div className="absolute top-0 left-0 z-50 w-full">
        <Navbar />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center pointer-events-none">
        <BlurText
          text="Looking for Peta?!"
          delay={200}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-7xl font-semibold mb-8"
        />
        <div className=" max-w-2xl">
          <BlurText
            text="WE DO DESIGN & CODE"
            delay={400}
            animateBy="words"
            direction="top"
            className="text-lg text-neutral-300"
            onAnimationComplete={handleAnimationComplete}
          />
        </div>
      </div>
    </section>
  );
}
