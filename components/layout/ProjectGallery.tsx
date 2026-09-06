"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { Project } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

type ProjectGalleryProps = {
  project: Project;
};

export default function ProjectGallery({ project }: ProjectGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getDistance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      const horizontalTween = gsap.to(track, {
        x: () => -getDistance(),

        ease: "none",

        scrollTrigger: {
          trigger: section,

          start: "top top",

          end: () => `+=${getDistance()}`,

          pin: true,

          scrub: 1,

          anticipatePin: 1,

          invalidateOnRefresh: true,
        },
      });

      gsap.utils
        .toArray<HTMLElement>(".project-gallery-image")
        .forEach((image) => {
          gsap.fromTo(
            image,
            {
              scale: 1.08,
            },
            {
              scale: 1,

              ease: "none",

              scrollTrigger: {
                trigger: image,

                containerAnimation: horizontalTween,

                start: "left right",

                end: "right left",

                scrub: true,
              },
            },
          );
        });

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      <div
        ref={trackRef}
        className="flex h-screen w-max items-center gap-[8vw] px-[8vw]"
      >
        {project.gallery.map((image, index) => {
          const size =
            image.size === "large"
              ? "w-[70vw] h-[82vh]"
              : image.size === "medium"
                ? "w-[52vw] h-[72vh]"
                : "w-[42vw] h-[65vh]";

          return (
            <div
              key={image.src}
              className={`relative shrink-0 overflow-hidden ${size}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="80vw"
                className="project-gallery-image object-cover"
              />

              <div className="absolute bottom-4 left-4 text-[9px] uppercase tracking-[0.12em] text-white/50">
                0{index + 1}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
