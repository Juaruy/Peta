"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  rotationEnd?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  rotationEnd = "top 35%",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;

    if (!el) return;

    const scroller = scrollContainerRef?.current || window;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: baseOpacity,
          rotate: baseRotation,
          filter: enableBlur ? `blur(${blurStrength}px)` : "blur(0px)",
          transformOrigin: "0% 50%",
        },
        {
          opacity: 1,
          rotate: 0,
          filter: "blur(0px)",
          ease: "none",

          scrollTrigger: {
            trigger: el,
            scroller,

            start: "top 90%",
            end: rotationEnd,

            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    }, el);

    return () => {
      ctx.revert();
    };
  }, [
    scrollContainerRef,
    enableBlur,
    baseOpacity,
    baseRotation,
    blurStrength,
    rotationEnd,
  ]);

  return (
    <div className="w-full overflow-x-clip">
      <div ref={containerRef} className={containerClassName}>
        {children}
      </div>
    </div>
  );
};

export default ScrollReveal;
