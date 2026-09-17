"use client";

import { use, useLayoutEffect, useRef } from "react";

import { useRouter } from "next/navigation";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import DetailProject from "@/components/layout/DetailProject";
import NextProject from "@/components/layout/NextProject";

import { projects } from "@/data/projects";

import { useLenis } from "@/lib/lenis-context";

gsap.registerPlugin(ScrollTrigger);

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export default function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = use(params);

  const router = useRouter();

  const lenis = useLenis();

  const project = projects[slug];

  if (!project) {
    return null;
  }

  const nextProjectSlug = project.nextProject.slug;

  const nextProject = projects[nextProjectSlug];

  if (!nextProject) {
    return null;
  }

  const horizontalSectionRef = useRef<HTMLElement>(null);

  const horizontalTrackRef = useRef<HTMLDivElement>(null);

  const nextProjectRef = useRef<HTMLElement>(null);

  // ==========================================================================
  // RESET SCROLL WHEN PROJECT CHANGES
  // ==========================================================================

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;

    window.history.scrollRestoration = "manual";

    // Stop Lenis supaya momentum / posisi scroll lama
    // tidak mengganggu reset route baru.
    lenis?.stop();

    // Reset Lenis ke posisi paling atas.
    lenis?.scrollTo(0, {
      immediate: true,
    });

    // Reset native browser scroll.
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    const frame1 = requestAnimationFrame(() => {
      lenis?.scrollTo(0, {
        immediate: true,
      });

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      const frame2 = requestAnimationFrame(() => {
        lenis?.scrollTo(0, {
          immediate: true,
        });

        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto",
        });

        ScrollTrigger.refresh();

        // Setelah posisi benar, aktifkan kembali Lenis.
        lenis?.start();
      });

      return () => {
        cancelAnimationFrame(frame2);
      };
    });

    return () => {
      cancelAnimationFrame(frame1);

      lenis?.start();

      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [slug, lenis]);

  // ==========================================================================
  // DETAIL PROJECT — HORIZONTAL SCROLL
  // ==========================================================================

  useLayoutEffect(() => {
    const section = horizontalSectionRef.current;

    const track = horizontalTrackRef.current;

    if (!section || !track) {
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (isMobile) {
      return;
    }

    const ctx = gsap.context(() => {
      const heroContent = track.querySelector<HTMLElement>(
        ".project-hero-content",
      );

      const firstGallery = track.querySelector<HTMLElement>(
        ".project-gallery-item",
      );

      if (!heroContent) {
        return;
      }

      gsap.set(heroContent, {
        opacity: 1,
        x: 0,
      });

      const getDistance = () => {
        return Math.max(0, track.scrollWidth - window.innerWidth);
      };

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

      const heroFadeStart = 0.05;

      const heroFadeEnd = 0.18;

      const updateHeroAnimation = () => {
        const progress = horizontalTween.progress();

        const fadeProgress = gsap.utils.clamp(
          0,
          1,
          gsap.utils.mapRange(heroFadeStart, heroFadeEnd, 0, 1, progress),
        );

        const heroSlide = gsap.utils.interpolate(0, -60, fadeProgress);

        const trackX = gsap.getProperty(track, "x") as number;

        gsap.set(heroContent, {
          x: -trackX + heroSlide,

          opacity: 1 - fadeProgress,
        });
      };

      horizontalTween.eventCallback("onUpdate", updateHeroAnimation);

      if (firstGallery) {
        gsap.set(firstGallery, {
          zIndex: 20,
        });
      }

      updateHeroAnimation();

      ScrollTrigger.refresh();

      updateHeroAnimation();
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  // ==========================================================================
  // NEXT PROJECT
  // ==========================================================================

  useLayoutEffect(() => {
    const section = nextProjectRef.current;

    if (!section) {
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (isMobile) {
      return;
    }

    const ctx = gsap.context(() => {
      const content = section.querySelector<HTMLElement>(
        ".next-project-content",
      );

      if (!content) {
        return;
      }

      let transitionStarted = false;

      gsap.set(content, {
        x: 0,
      });

      const trigger = ScrollTrigger.create({
        trigger: section,

        start: "top top",

        end: "+=100%",

        pin: true,

        anticipatePin: 1,

        invalidateOnRefresh: true,

        onEnter: () => {
          transitionStarted = false;

          gsap.set(content, {
            x: 0,
          });
        },

        onEnterBack: () => {
          transitionStarted = false;

          gsap.set(content, {
            x: 0,
          });
        },

        onLeaveBack: () => {
          transitionStarted = false;

          gsap.set(content, {
            x: 0,
          });
        },
      });

      const handleWheel = (event: WheelEvent) => {
        // Scroll ke atas tidak melakukan navigasi.
        if (event.deltaY <= 0) {
          return;
        }

        // Hanya bekerja ketika NextProject sedang pinned.
        if (!trigger.isActive) {
          return;
        }

        // Selama transition berlangsung,
        // tahan wheel supaya tidak ada scroll tambahan.
        if (transitionStarted) {
          event.preventDefault();

          return;
        }

        event.preventDefault();

        transitionStarted = true;

        gsap.to(content, {
          x: -window.innerWidth,

          duration: 0.65,

          ease: "power3.inOut",

          overwrite: true,

          onComplete: () => {
            router.push(`/work/${nextProjectSlug}`);
          },
        });
      };

      window.addEventListener("wheel", handleWheel, {
        passive: false,
      });

      ScrollTrigger.refresh();

      return () => {
        window.removeEventListener("wheel", handleWheel);

        trigger.kill();
      };
    }, section);

    return () => {
      ctx.revert();
    };
  }, [nextProjectSlug, router]);

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
      "
      style={{
        backgroundColor: project.theme.background,
      }}
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          transition-opacity
          duration-500
        "
        style={{
          backgroundColor: project.theme.background,
          opacity: project.theme.backgroundOpacity,
        }}
      />

      {/* ================================================================
          DETAIL PROJECT
          ================================================================ */}

      <section
        ref={horizontalSectionRef}
        className="
          relative
          z-10
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

      {/* ================================================================
          NEXT PROJECT
          ================================================================ */}

      <NextProject
        ref={nextProjectRef}
        project={nextProject}
        slug={nextProjectSlug}
      />
    </main>
  );
}
