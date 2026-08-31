"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const aboutText =
  "We’re an independent studio helping artists and labels bring releases and campaigns to life visually.";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;

    if (!section || !text) return;

    const ctx = gsap.context(() => {
      const words = text.querySelectorAll<HTMLElement>(".about-word");

      gsap.set(words, {
        opacity: 0.18,
      });

      gsap.to(words, {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="studio"
      className="relative min-h-[180vh] w-full bg-white px-6 text-black md:px-12 lg:min-h-[200vh] lg:px-16"
    >
      <div className="sticky top-0 flex min-h-screen w-full flex-col justify-center py-12 md:py-12 lg:py-32">
        {/* LABEL */}
        <div className="mb-12 md:mb-16 lg:mb-12">
          <span className="font-aeonik text-sm font-medium uppercase tracking-wide text-black/50">
            About
          </span>
        </div>

        {/* ABOUT TEXT */}
        <div className="w-full">
          <p
            ref={textRef}
            className="max-w-[1400px] font-aeonik text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-6xl lg:text-8xl"
          >
            {aboutText.split(" ").map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="about-word inline-block"
              >
                {word}
                {index !== aboutText.split(" ").length - 1 && "\u00A0"}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
