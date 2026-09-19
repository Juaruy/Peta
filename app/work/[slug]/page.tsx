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

  const horizontalSectionRef = useRef<HTMLElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const nextProjectRef = useRef<HTMLElement>(null);

  const isNavigatingRef = useRef(false);

  if (!project) return null;

  const nextProjectSlug = project.nextProject.slug;
  const nextProject = projects[nextProjectSlug];

  if (!nextProject) return null;

  // ============================================================
  // RESET SCROLL
  // ============================================================

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;

    window.history.scrollRestoration = "manual";
    isNavigatingRef.current = false;

    lenis?.scrollTo(0, {
      immediate: true,
    });

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    const frame = requestAnimationFrame(() => {
      lenis?.scrollTo(0, {
        immediate: true,
      });

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(frame);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [slug, lenis]);

  // ============================================================
  // DETAIL PROJECT — HORIZONTAL SCROLL
  // ============================================================

  useLayoutEffect(() => {
    const section = horizontalSectionRef.current;
    const track = horizontalTrackRef.current;

    if (!section || !track) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (isMobile) return;

    const ctx = gsap.context(() => {
      const heroContent = track.querySelector<HTMLElement>(
        ".project-hero-content",
      );

      const firstGallery = track.querySelector<HTMLElement>(
        ".project-gallery-item",
      );

      const galleryItems = track.querySelectorAll<HTMLElement>(
        ".project-gallery-item",
      );

      if (!heroContent) return;

      // ----------------------------------------------------------
      // INITIAL STATES
      // ----------------------------------------------------------

      gsap.set(heroContent, {
        opacity: 1,
        x: 0,
      });

      // Gallery starts hidden and slightly lower.
      gsap.set(galleryItems, {
        opacity: 0,
        scale: 0.97,
        y: 18,
      });

      // ----------------------------------------------------------
      // HORIZONTAL TRACK
      // ----------------------------------------------------------

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

      // ----------------------------------------------------------
      // HERO TEXT
      // ----------------------------------------------------------
      //
      // Text mulai fade lebih awal,
      // tetapi pergerakannya dibuat lebih panjang/smooth.
      //

      const heroFadeStart = 0.02;
      const heroFadeEnd = 0.15;

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

      // ----------------------------------------------------------
      // GALLERY ENTRY
      // ----------------------------------------------------------
      //
      // Image sengaja dibuat lebih lambat.
      //

      const galleryEntry = gsap.timeline({
        delay: 0.28,
      });

      galleryEntry.to(galleryItems, {
        opacity: 1,
        scale: 1,
        y: 0,

        duration: 1.15,

        stagger: 0.12,

        ease: "power3.out",

        clearProps: "transform",
      });

      ScrollTrigger.refresh();

      updateHeroAnimation();
    }, section);

    return () => ctx.revert();
  }, [slug]);

  // ============================================================
  // NEXT PROJECT → DETAIL PROJECT HANDOFF
  // ============================================================

  useLayoutEffect(() => {
    const section = horizontalSectionRef.current;

    if (!section) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (isMobile) return;

    const savedPosition = sessionStorage.getItem("next-project-title-position");

    if (!savedPosition) return;

    let previewTop = 0;

    try {
      const parsed = JSON.parse(savedPosition);

      previewTop = parsed.top;
    } catch {
      sessionStorage.removeItem("next-project-title-position");

      return;
    }

    const heroTitle = section.querySelector<HTMLElement>(".project-hero h1");

    const category = section.querySelector<HTMLElement>(
      ".project-hero-content > div:first-child",
    );

    const contentWrapper = section.querySelector<HTMLElement>(
      ".project-hero-content > div:nth-child(3)",
    );

    if (!heroTitle || !category || !contentWrapper) {
      return;
    }

    const description = contentWrapper.querySelector<HTMLElement>(
      ":scope > div:first-child p",
    );

    const meta = contentWrapper.querySelector<HTMLElement>(
      ":scope > div:nth-child(2)",
    );

    const cta = contentWrapper.querySelector<HTMLElement>(
      ":scope > div:nth-child(3)",
    );

    // ----------------------------------------------------------
    // INITIAL STATE
    // ----------------------------------------------------------

    gsap.set(heroTitle, {
      autoAlpha: 1,
      y: 0,
    });

    gsap.set(category, {
      autoAlpha: 1,
      y: 0,
    });

    if (description) {
      gsap.set(description, {
        autoAlpha: 0,
        y: 20,
      });
    }

    if (meta) {
      gsap.set(meta, {
        autoAlpha: 0,
        y: 20,
      });
    }

    if (cta) {
      gsap.set(cta, {
        autoAlpha: 0,
        y: 20,
      });
    }

    let timeline: gsap.core.Timeline | null = null;

    const frame = requestAnimationFrame(() => {
      const categoryRect = category.getBoundingClientRect();

      const startY = previewTop - categoryRect.top;

      // --------------------------------------------------------
      // TEXT START POSITION
      // --------------------------------------------------------

      gsap.set([category, heroTitle], {
        x: 0,
        y: startY,
        autoAlpha: 1,
      });

      const distance = Math.abs(startY);

      // Start lebih cepat,
      // tapi movement dibuat lebih smooth.
      const duration = gsap.utils.clamp(0.85, 1.35, distance / 430);

      timeline = gsap.timeline({
        onComplete: () => {
          sessionStorage.removeItem("next-project-title-position");

          gsap.set([category, heroTitle], {
            x: 0,
            y: 0,
          });
        },
      });

      // --------------------------------------------------------
      // TITLE + CATEGORY
      // --------------------------------------------------------

      timeline.to(
        [category, heroTitle],
        {
          x: 0,
          y: 0,

          duration,

          ease: "power3.out",
        },
        0,
      );

      // --------------------------------------------------------
      // DESCRIPTION
      //
      // Mulai sedikit lebih cepat setelah title bergerak.
      // Durasi lebih panjang supaya smooth.
      // --------------------------------------------------------

      if (description) {
        timeline.to(
          description,
          {
            autoAlpha: 1,
            y: 0,

            duration: 0.65,

            ease: "power3.out",
          },
          "-=0.42",
        );
      }

      // --------------------------------------------------------
      // META
      // --------------------------------------------------------

      if (meta) {
        timeline.to(
          meta,
          {
            autoAlpha: 1,
            y: 0,

            duration: 0.65,

            ease: "power3.out",
          },
          "-=0.48",
        );
      }

      // --------------------------------------------------------
      // CTA
      // --------------------------------------------------------

      if (cta) {
        timeline.to(
          cta,
          {
            autoAlpha: 1,
            y: 0,

            duration: 0.65,

            ease: "power3.out",
          },
          "-=0.48",
        );
      }
    });

    return () => {
      cancelAnimationFrame(frame);

      timeline?.kill();
    };
  }, [slug]);

  // ============================================================
  // NEXT PROJECT PREVIEW
  // ============================================================

  useLayoutEffect(() => {
    const section = nextProjectRef.current;

    if (!section) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (isMobile) return;

    const ctx = gsap.context(() => {
      const panel = section.querySelector<HTMLElement>(".next-project-panel");

      const title = section.querySelector<HTMLElement>(".next-project-title");

      const category = section.querySelector<HTMLElement>(
        ".next-project-category",
      );

      const titleGroup = section.querySelector<HTMLElement>(
        ".next-project-title-group",
      );

      const heroTitle =
        horizontalSectionRef.current?.querySelector<HTMLElement>(
          ".project-hero h1",
        );

      if (!panel || !title || !category || !titleGroup || !heroTitle) {
        return;
      }

      // ----------------------------------------------------------
      // HERO TYPOGRAPHY
      // ----------------------------------------------------------

      const heroStyle = window.getComputedStyle(heroTitle);

      const heroFontSize = parseFloat(heroStyle.fontSize);

      const heroFontWeight = heroStyle.fontWeight;

      const heroFontFamily = heroStyle.fontFamily;

      const heroLetterSpacing =
        heroStyle.letterSpacing === "normal"
          ? 0
          : parseFloat(heroStyle.letterSpacing);

      // ----------------------------------------------------------
      // DESTINATION COLORS
      // ----------------------------------------------------------

      const destinationTitleColor =
        nextProject.heroTheme === "light" ? "#000000" : "#ffffff";

      const destinationCategoryColor =
        nextProject.heroTheme === "light"
          ? "rgba(0, 0, 0, 0.4)"
          : "rgba(255, 255, 255, 0.4)";

      // ----------------------------------------------------------
      // INITIAL STATE
      // ----------------------------------------------------------

      gsap.set(panel, {
        width: "30%",
      });

      gsap.set(title, {
        x: 0,
        y: 0,
        color: "#111111",
      });

      gsap.set(category, {
        color: "rgba(17, 17, 17, 0.4)",
      });

      // ----------------------------------------------------------
      // TRANSITION
      // ----------------------------------------------------------

      const transition = gsap.timeline({
        scrollTrigger: {
          trigger: section,

          start: "top top",

          end: "+=70%",

          pin: true,

          scrub: 0.6,

          anticipatePin: 1,

          invalidateOnRefresh: true,

          onUpdate: (self) => {
            const progress = self.progress;

            const titleColor = gsap.utils.interpolate(
              "#111111",
              destinationTitleColor,
              progress,
            );

            const categoryColor = gsap.utils.interpolate(
              "rgba(17, 17, 17, 0.4)",
              destinationCategoryColor,
              progress,
            );

            gsap.set(title, {
              color: titleColor,
            });

            gsap.set(category, {
              color: categoryColor,
            });
          },

          onScrubComplete: (self) => {
            if (self.progress < 0.9995) {
              return;
            }

            if (isNavigatingRef.current) {
              return;
            }

            const panelRect = panel.getBoundingClientRect();

            const viewportWidth = window.innerWidth;

            if (panelRect.width < viewportWidth - 2) {
              return;
            }

            isNavigatingRef.current = true;

            const groupRect = titleGroup.getBoundingClientRect();

            sessionStorage.setItem(
              "next-project-title-position",
              JSON.stringify({
                top: groupRect.top,
              }),
            );

            router.push(`/work/${nextProjectSlug}`);
          },
        },
      });

      // ----------------------------------------------------------
      // PANEL
      // ----------------------------------------------------------

      transition.to(
        panel,
        {
          width: "100%",

          backgroundColor: nextProject.theme.background,

          ease: "none",

          duration: 1,
        },
        0,
      );

      // ----------------------------------------------------------
      // TITLE
      //
      // Text transform selesai lebih cepat
      // daripada panel.
      // ----------------------------------------------------------

      transition.to(
        title,
        {
          fontSize: heroFontSize,
          fontWeight: heroFontWeight,
          fontFamily: heroFontFamily,
          letterSpacing: heroLetterSpacing,

          ease: "power2.out",

          duration: 0.62,
        },
        0,
      );

      // ----------------------------------------------------------
      // CATEGORY
      // ----------------------------------------------------------

      transition.to(
        category,
        {
          color: destinationCategoryColor,

          ease: "power2.out",

          duration: 0.62,
        },
        0,
      );

      // ----------------------------------------------------------
      // INITIAL COLORS
      // ----------------------------------------------------------

      const initialProgress = transition.scrollTrigger?.progress ?? 0;

      const initialTitleColor = gsap.utils.interpolate(
        "#111111",
        destinationTitleColor,
        initialProgress,
      );

      const initialCategoryColor = gsap.utils.interpolate(
        "rgba(17, 17, 17, 0.4)",
        destinationCategoryColor,
        initialProgress,
      );

      gsap.set(title, {
        color: initialTitleColor,
      });

      gsap.set(category, {
        color: initialCategoryColor,
      });
    }, section);

    return () => ctx.revert();
  }, [nextProject, nextProjectSlug, router]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundColor: project.theme.background,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          backgroundColor: project.theme.background,

          opacity: project.theme.backgroundOpacity,
        }}
      />

      {/* ========================================================
          DETAIL PROJECT
      ======================================================== */}

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

      {/* ========================================================
          NEXT PROJECT
      ======================================================== */}

      <NextProject
        ref={nextProjectRef}
        project={nextProject}
        slug={nextProjectSlug}
      />
    </main>
  );
}
