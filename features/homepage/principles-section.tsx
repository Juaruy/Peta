"use client";

import ScrollReveal from "@/components/animations/ScrollReveal";
import AccordionGallery from "@/components/animations/AccordionGallery";

const items = [
  {
    title: "Ideate",
    description:
      "Ideation is an essential part of our process that helps shape a clear visual direction from the start. Get this right early, and everything else falls into place.",
    color: "#000000",
  },
  {
    title: "Define",
    description:
      "Lorem Ipsum is placeholder text used in printing, typesetting, and digital design, originating from a scrambled version of Cicero's 1st-century BC text De Finibus Bonorum et Malorum",
    color: "#000000",
  },
  {
    title: "Create",
    description:
      "We handle the heavy lifting across design, motion, and video so you don’t have to. You stay focused on the music, we’ll take care of the rest.",
    color: "#000000",
  },
  {
    title: "Testing",
    description:
      "Lorem Ipsum is placeholder text used in printing, typesetting, and digital design, originating from a scrambled version of Cicero's 1st-century BC text De Finibus Bonorum et Malorum",
    color: "#000000",
  },
  {
    title: "Deliver",
    description:
      "You get everything you need, without having to lift a finger. Ready-to-use creative, delivered when you need it.",
    color: "#000000",
  },
];

export default function PrinciplesSection() {
  return (
    <section className="relative w-full bg-black px-6 py-12 text-white md:px-12 md:py-12 lg:px-16 lg:py-32">
      {/* HEADING + DESCRIPTION */}
      <ScrollReveal>
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr] items-center lg:gap-16">
          {/* HEADING */}
          <div className="flex w-full justify-start">
            <h2 className="whitespace-nowrap text-5xl font-aeonik font-medium leading-[1.05]  md:text-6xl lg:text-7xl">
              Our Process
            </h2>
          </div>

          {/* DESCRIPTION */}
          <div className="flex w-full justify-end">
            <p className="max-w-sm text-left text-base leading-[1.6] text-white/60 md:text-sm">
              A structured approach to design that turns ideas into meaningful
              digital experiences through research, strategy, visual design,
              implementation, and continuous refinement.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* ACCORDION */}
      <div className="mt-12 w-full min-w-0 md:mt-16 lg:mt-24">
        <AccordionGallery
          items={items}
          defaultIndex={2}
          expandRatio={0.52}
          trigger="hover"
          accentColor="#ffffff"
          overlayColor="#000000"
          textColor="#ffffff"
          grayscale
          duration={0.6}
          ease="power3.out"
          parallax={0.5}
          tilt={8}
          stagger={0.06}
          height={460}
          gap={10}
          radius={16}
          orientation="horizontal"
          glowEnabled
          glowEdgeSensitivity={30}
          glowColor="40 80 80"
          glowBackgroundColor="#120F17"
          glowRadius={40}
          glowIntensity={0.7}
          glowConeSpread={25}
          glowColors={["#ffffff"]}
          glowFillOpacity={0.35}
        />
      </div>
    </section>
  );
}
