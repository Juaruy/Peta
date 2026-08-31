"use client";

import Image from "next/image";

import { useLayoutEffect, useRef } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function OverlapTransparentText() {
  const sectionRef = useRef<HTMLElement>(null);

  const frontRef = useRef<HTMLDivElement>(null);

  const logoRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    const front = frontRef.current;

    const logo = logoRef.current;

    if (!section || !front || !logo) return;

    const ctx = gsap.context(() => {
      // ======================================================================
      // INITIAL STATE
      // ======================================================================

      gsap.set(front, {
        scale: 1,
        transformOrigin: "50% 50%",
        force3D: true,
        willChange: "transform",
      });

      gsap.set(logo, {
        opacity: 0,
        force3D: true,
      });

      // ======================================================================
      // TIMELINE
      // ======================================================================

      const tl = gsap.timeline({
        paused: true,
      });

      // ----------------------------------------------------------------------
      // PHASE 1
      // ----------------------------------------------------------------------

      tl.to(front, {
        scale: 3,
        duration: 35,
        ease: "none",
      });

      // ----------------------------------------------------------------------
      // PHASE 2
      // ----------------------------------------------------------------------

      tl.to(front, {
        scale: 15,
        duration: 25,
        ease: "none",
      });

      // ----------------------------------------------------------------------
      // PHASE 3
      // ----------------------------------------------------------------------

      tl.to(front, {
        scale: 500,
        duration: 25,
        ease: "none",
      });

      // ----------------------------------------------------------------------
      // LOGO REVEAL
      //
      // Mulai sekitar timeline 51.
      // ----------------------------------------------------------------------

      tl.to(
        logo,
        {
          opacity: 1,
          duration: 17,
          ease: "none",
        },
        51,
      );

      // ======================================================================
      // SCROLL TRIGGER
      //
      // Section ini sekarang menjadi END PIN dari StackedScroll.
      //
      // Alurnya:
      //
      // Stacked panels
      //        ↓
      // Overlap section masuk viewport
      //        ↓
      // Overlap mengambil alih pin
      //        ↓
      // scale animation berjalan berdasarkan scroll
      // ======================================================================

      ScrollTrigger.create({
        trigger: section,

        start: "top top",

        end: "+=500%",

        pin: true,

        scrub: true,

        animation: tl,

        anticipatePin: 1,

        invalidateOnRefresh: true,
      });

      // ======================================================================
      // REFRESH
      // ======================================================================

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, section);

    // ========================================================================
    // CLEANUP
    // ========================================================================

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-stacked-end-pin
      className="
        relative
        h-screen
        w-full
        overflow-hidden
      "
    >
      {/* ====================================================================
          BACKGROUND
      ==================================================================== */}

      <div
        className="
          absolute
          inset-0
          z-0
          h-full
          overflow-hidden
          bg-white
        "
      >
        {/* ==================================================================
            BACKGROUND VIDEO
        ================================================================== */}

        <video
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            opacity-50
          "
          src="/islammakhacev.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />

        {/* ==================================================================
            OPTIONAL OVERLAY
        ================================================================== */}

        <div className="absolute inset-0 bg-white/10" />

        {/* ==================================================================
            LOGO
        ================================================================== */}

        <div
          className="
            relative
            z-10
            flex
            h-full
            items-center
            justify-center
            px-6
          "
        >
          <div
            ref={logoRef}
            className="
              relative
              w-[30vw]
              max-w-[320px]
            "
          >
            <Image
              src="/LogoPetaHitam.png"
              alt="Logo"
              width={1200}
              height={1200}
              className="
                h-auto
                w-full
                object-contain
              "
              priority
            />
          </div>
        </div>
      </div>

      {/* ====================================================================
          FRONT
      ==================================================================== */}

      <div
        ref={frontRef}
        className="
          absolute
          inset-0
          z-10
          h-screen
          origin-center
          overflow-hidden
          will-change-transform
        "
      >
        <svg
          className="
            absolute
            inset-0
            h-full
            w-full
          "
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <mask id="text-cutout">
              <rect x="0" y="0" width="1000" height="1000" fill="white" />

              <text
                x="500"
                y="500"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="black"
                fontFamily="Aeonik"
                fontSize="140"
                fontWeight="700"
              >
                Stay tunes
              </text>
            </mask>
          </defs>

          <rect
            x="0"
            y="0"
            width="1000"
            height="1000"
            fill="black"
            mask="url(#text-cutout)"
          />
        </svg>
      </div>
    </section>
  );
}
