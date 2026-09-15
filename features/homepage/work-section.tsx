"use client";

import ScrollReveal from "@/components/animations/ScrollReveal";
import StackedScroll from "@/components/animations/StackedScroll";
import OverlapTransparentText from "@/components/animations/OverlapTransparentText";

const projects = [
  {
    title: "Common Ground Fight",
    description:
      "From simple promo assets to full-blown creative concepts, we design visuals that capture your sound and energy. Think cover art, motion teasers, visualisers, carousels and more.",
    image: "/images/reel.jpg",
    tags: ["Boxing Platform", "Web Design", "Dashboard", "Design System"],
    link: "/work/common-ground-fight",
  },
  {
    title: "Neo Tech",
    description:
      "From simple promo assets to full-blown creative concepts, we design visuals that capture your sound and energy. Think cover art, motion teasers, visualisers, carousels and more.",
    image: "/images/haerin1.jpg",
    tags: ["UI/UX Design", "Web Design", "Dashboard", "Design System"],
    link: "/work/neo-tech",
  },
  {
    title: "Neo Tech",
    description:
      "From simple promo assets to full-blown creative concepts, we design visuals that capture your sound and energy. Think cover art, motion teasers, carousels and more.",
    image: "/images/haerin2.jpg",
    tags: ["UI/UX Design", "Web Design", "Dashboard", "Design System"],
  },
];

export default function WorkSection() {
  return (
    <section id="work" className="relative w-full bg-black text-white">
      {/* ================================================================ */}
      {/* WORK CONTENT */}
      {/* ================================================================ */}

      <div className="px-6 py-12 md:px-12 md:py-12 lg:px-16 lg:py-32">
        {/* HEADING + DESCRIPTION */}
        <div className="relative z-20">
          <ScrollReveal>
            <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
              <div className="flex w-full justify-start">
                <h2 className="whitespace-nowrap font-aeonik text-5xl font-medium leading-[1.05] tracking-[-0.04em] md:text-6xl lg:text-7xl">
                  Selected Work
                </h2>
              </div>

              <div className="flex w-full justify-end">
                <p className="max-w-sm text-left text-base leading-[1.6] text-white/60 md:text-sm">
                  A structured approach to design that turns ideas into
                  meaningful digital experiences through research, strategy,
                  visual design, implementation, and continuous refinement.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* STACKED SCROLL */}
        <StackedScroll items={projects} />
      </div>

      {/* ================================================================ */}
      {/* FULL-BLEED OVERLAP */}
      {/* ================================================================ */}

      <OverlapTransparentText />
    </section>
  );
}
