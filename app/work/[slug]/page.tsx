"use client";

import { use, useLayoutEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { projects } from "@/data/projects";

import DetailProject from "@/components/layout/DetailProject";
import NextProject from "@/components/layout/NextProject";

gsap.registerPlugin(ScrollTrigger);

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export default function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = use(params);

  const project = projects[slug];

  if (!project) {
    return null;
  }

  // =========================================================
  // NEXT PROJECT
  // =========================================================

  const nextProjectSlug = project.nextProject.slug;
  const nextProject = projects[nextProjectSlug];

  if (!nextProject) {
    return null;
  }

  // =========================================================
  // REFS
  // =========================================================

  const horizontalSectionRef = useRef<HTMLElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);

  // =========================================================
  // HORIZONTAL SCROLL
  // =========================================================

  useLayoutEffect(() => {
    const section = horizontalSectionRef.current;
    const track = horizontalTrackRef.current;

    if (!section || !track) {
      return;
    }

    /* =========================================================
       MOBILE

       Mobile tidak menggunakan horizontal GSAP.
       Biarkan browser melakukan normal vertical scroll.
    ========================================================= */

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (isMobile) {
      return;
    }

    /* =========================================================
       DESKTOP GSAP
    ========================================================= */

    const ctx = gsap.context(() => {
      /* =======================================================
         ELEMENTS
      ======================================================= */

      const heroContent = track.querySelector<HTMLElement>(
        ".project-hero-content",
      );

      const firstGallery = track.querySelector<HTMLElement>(
        ".project-gallery-item",
      );

      if (!heroContent) {
        return;
      }

      /* =======================================================
         INITIAL HERO STATE
      ======================================================= */

      gsap.set(heroContent, {
        opacity: 1,
        x: 0,
      });

      /* =======================================================
         HORIZONTAL DISTANCE
      ======================================================= */

      const getDistance = () => {
        return Math.max(0, track.scrollWidth - window.innerWidth);
      };

      /* =======================================================
         HORIZONTAL SCROLL
      ======================================================= */

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

      /* =======================================================
         HERO ANIMATION

         Hero:
         opacity 1 → 0
         x 0 → -60px

         Tapi tetap dikompensasi terhadap pergerakan track
         supaya hero terlihat stay di viewport.
      ======================================================= */

      const heroFadeStart = 0.05;
      const heroFadeEnd = 0.18;

      const updateHeroAnimation = () => {
        const progress = horizontalTween.progress();

        /* -----------------------------------------------------
           FADE PROGRESS
        ----------------------------------------------------- */

        const fadeProgress = gsap.utils.clamp(
          0,
          1,
          gsap.utils.mapRange(heroFadeStart, heroFadeEnd, 0, 1, progress),
        );

        /* -----------------------------------------------------
           HERO SLIDE LEFT
        ----------------------------------------------------- */

        const heroSlide = gsap.utils.interpolate(0, -60, fadeProgress);

        /* -----------------------------------------------------
           TRACK POSITION
        ----------------------------------------------------- */

        const trackX = gsap.getProperty(track, "x") as number;

        /* -----------------------------------------------------
           APPLY
        ----------------------------------------------------- */

        gsap.set(heroContent, {
          x: -trackX + heroSlide,
          opacity: 1 - fadeProgress,
        });
      };

      /* =======================================================
         UPDATE ON SCROLL
      ======================================================= */

      horizontalTween.eventCallback("onUpdate", updateHeroAnimation);

      /* =======================================================
         FIRST IMAGE
      ======================================================= */

      if (firstGallery) {
        gsap.set(firstGallery, {
          zIndex: 20,
        });
      }

      /* =======================================================
         INITIAL UPDATE
      ======================================================= */

      updateHeroAnimation();

      /* =======================================================
         REFRESH
      ======================================================= */

      ScrollTrigger.refresh();

      updateHeroAnimation();
    }, section);

    /* =========================================================
       CLEANUP
    ========================================================= */

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <main
      className="
        relative
        overflow-hidden
        bg-[#111111]
        text-[#f5f5f5]
      "
    >
      {/* =====================================================
          PROJECT DETAIL
      ===================================================== */}

      <section
        ref={horizontalSectionRef}
        className="
          relative
          h-screen
          w-full
          overflow-hidden
          max-md:h-auto
          max-md:overflow-visible
        "
      >
        <div
          ref={horizontalTrackRef}
          className="
            flex
            h-screen
            w-max
            max-md:h-auto
            max-md:w-full
            max-md:flex-col
          "
        >
          <DetailProject project={project} />
        </div>
      </section>

      {/* =====================================================
          NEXT PROJECT
      ===================================================== */}

      <NextProject project={nextProject} slug={nextProjectSlug} />
    </main>
  );
}
