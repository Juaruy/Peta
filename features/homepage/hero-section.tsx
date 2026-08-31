"use client";

import BlurText from "@/components/animations/BlurText";

const handleAnimationComplete = () => {
  console.log("Animation completed!");
};

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-black text-white"
    >
      {/* Hero Content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-6 text-center pointer-events-none">
        <BlurText
          text="Hello World!!!"
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
            className="text-lg"
            onAnimationComplete={handleAnimationComplete}
          />
        </div>
      </div>
    </section>
  );
}
