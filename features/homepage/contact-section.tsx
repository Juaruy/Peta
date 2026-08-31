"use client";

import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NeoButton from "@/components/ui/neo-button";

gsap.registerPlugin(ScrollTrigger);

export default function LetsCollaborate() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleAreaRef = useRef<HTMLDivElement>(null);
  const letsRef = useRef<HTMLDivElement>(null);
  const collaborateRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /* ================================================================
     BACK TO TOP
     ================================================================= */

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const titleArea = titleAreaRef.current;
    const lets = letsRef.current;
    const collaborate = collaborateRef.current;
    const line = lineRef.current;
    const content = contentRef.current;

    if (!section || !titleArea || !lets || !collaborate || !line || !content) {
      return;
    }

    const ctx = gsap.context(() => {
      /* ================================================================
         POSITION CALCULATION
         ================================================================= */

      const getPositions = () => {
        const width = titleArea.clientWidth;

        const letsWidth = lets.offsetWidth;
        const collaborateWidth = collaborate.offsetWidth;

        /* START */

        const letsStart = -(letsWidth + 50);
        const collaborateStart = width + 50;

        /* END */

        const centerX = width / 2;

        const letsEnd = centerX - letsWidth / 2;
        const collaborateEnd = centerX - collaborateWidth / 2;

        return {
          letsStart,
          collaborateStart,
          letsEnd,
          collaborateEnd,
        };
      };

      /* ================================================================
         INITIAL STATE
         ================================================================= */

      const positions = getPositions();

      gsap.set(lets, {
        x: positions.letsStart,
        force3D: true,
      });

      gsap.set(collaborate, {
        x: positions.collaborateStart,
        force3D: true,
      });

      gsap.set(line, {
        scaleX: 0,
        transformOrigin: "center center",
      });

      gsap.set(content, {
        opacity: 0,
        y: 30,
      });

      /* ================================================================
   SCROLL TIMELINE

   Animasi mulai ketika section sudah 40% kereveal.

   top 60%:
   └── bagian atas section berada di 60% viewport
       → sekitar 40% section mulai terlihat.

   top 0%:
   └── animasi selesai ketika section mencapai bagian atas viewport.

   Jadi animasi punya ruang scroll yang jauh lebih panjang
   dibanding top 40% → top 30%.
   ================================================================= */

      const textTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end: "top top",
          scrub: 0.6,
          invalidateOnRefresh: true,

          onRefresh: () => {
            const newPositions = getPositions();

            gsap.set(lets, {
              x: newPositions.letsStart,
            });

            gsap.set(collaborate, {
              x: newPositions.collaborateStart,
            });
          },
        },
      });

      /* ================================================================
   TEXT
   LET'S + COLLABORATE
   ================================================================= */

      textTl.to(lets, {
        x: () => getPositions().letsEnd,
        duration: 2,
        ease: "none",
      });

      textTl.to(
        collaborate,
        {
          x: () => getPositions().collaborateEnd,
          duration: 2,
          ease: "none",
        },
        "<",
      );

      /* ================================================================
   DIVIDER
   CENTER → LEFT + RIGHT

   Jalan setelah seluruh text selesai.
   ================================================================= */

      textTl.to(
        line,
        {
          scaleX: 1,
          duration: 0.3,
          ease: "none",
        },
        ">",
      );

      /* ================================================================
   FOOTER CONTENT

   Jalan setelah divider selesai.
   ================================================================= */

      textTl.to(
        content,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        ">",
      );

      /* ================================================================
         REFRESH POSITION
         ================================================================= */

      ScrollTrigger.addEventListener("refreshInit", () => {
        const newPositions = getPositions();

        gsap.set(lets, {
          x: newPositions.letsStart,
        });

        gsap.set(collaborate, {
          x: newPositions.collaborateStart,
        });
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <>
      {/* ==================================================================
          FOOTER
          ================================================================= */}

      <footer
        ref={sectionRef}
        id="contact"
        className="
          relative
          min-h-screen
          w-full
          overflow-hidden
          bg-white
          text-black
        "
      >
        <div
          className="
            relative
            flex
            min-h-screen
            flex-col
            px-6
            py-8
            sm:px-8
            lg:px-12
          "
        >
          {/* ================================================================
              TITLE AREA
              ================================================================= */}

          <div
            ref={titleAreaRef}
            className="
              relative
              flex
              flex-1
              overflow-hidden
            "
          >
            {/* ============================================================
                LET'S
                ============================================================= */}

            <div
              ref={letsRef}
              className="
                absolute
                left-0
                top-[30%]
                -translate-y-1/2
                whitespace-nowrap
                text-center
                will-change-transform
              "
            >
              <span
                className="
                  block
                  font-aeonik
                  text-[16vw]
                  font-medium
                  leading-none
                  tracking-[-0.075em]
                  sm:text-[14vw]
                  lg:text-[11vw]
                "
              >
                Let&apos;s
              </span>
            </div>

            {/* ============================================================
                COLLABORATE
                ============================================================= */}

            <div
              ref={collaborateRef}
              className="
                absolute
                left-0
                top-[60%]
                -translate-y-1/2
                whitespace-nowrap
                text-center
                will-change-transform
              "
            >
              <span
                className="
                  block
                  font-aeonik
                  text-[16vw]
                  font-medium
                  leading-none
                  tracking-[-0.075em]
                  sm:text-[14vw]
                  lg:text-[11vw]
                "
              >
                Collaborate!
              </span>
            </div>
          </div>

          {/* ================================================================
              DIVIDER
              ================================================================= */}

          <div
            ref={lineRef}
            className="
              h-px
              w-full
              bg-black
            "
          />

          {/* ================================================================
              FOOTER CONTENT
              ================================================================= */}

          <div
            ref={contentRef}
            className="
              grid
              grid-cols-2
              gap-x-6
              gap-y-10
              pt-8
              sm:grid-cols-2
              sm:gap-x-8
              lg:grid-cols-4
              lg:gap-8
            "
          >
            {/* ============================================================
                MENU
                ============================================================= */}

            <div className="min-w-0">
              <p
                className="
                  mb-5
                  text-xs
                  uppercase
                  tracking-[0.12em]
                  text-black/40
                "
              >
                Menu
              </p>

              <nav className="flex flex-col items-start gap-2">
                {["Home", "Work", "About"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="
                      group
                      flex
                      items-center
                      gap-1
                      text-base
                      font-medium
                    "
                  >
                    <span>{item}</span>

                    <ArrowUpRight
                      size={14}
                      className="
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:translate-x-1
                        group-hover:-translate-y-1
                        group-hover:opacity-100
                      "
                    />
                  </a>
                ))}
              </nav>
            </div>

            {/* ============================================================
                CONNECT
                ============================================================= */}

            <div className="min-w-0">
              <p
                className="
                  mb-5
                  text-xs
                  uppercase
                  tracking-[0.12em]
                  text-black/40
                "
              >
                Connect
              </p>

              <nav className="flex flex-col items-start gap-2">
                <a
                  href="#"
                  className="
                    group
                    flex
                    items-center
                    gap-1
                    text-base
                    font-medium
                  "
                >
                  LinkedIn
                  <ArrowUpRight
                    size={14}
                    className="
                      opacity-0
                      transition-all
                      duration-300
                      group-hover:translate-x-1
                      group-hover:-translate-y-1
                      group-hover:opacity-100
                    "
                  />
                </a>

                <a
                  href="mailto:hello@example.com"
                  className="
                    group
                    flex
                    items-center
                    gap-1
                    text-base
                    font-medium
                  "
                >
                  Email
                  <ArrowUpRight
                    size={14}
                    className="
                      opacity-0
                      transition-all
                      duration-300
                      group-hover:translate-x-1
                      group-hover:-translate-y-1
                      group-hover:opacity-100
                    "
                  />
                </a>

                <a
                  href="#"
                  className="
                    group
                    flex
                    items-center
                    gap-1
                    text-base
                    font-medium
                  "
                >
                  Resume
                  <ArrowUpRight
                    size={14}
                    className="
                      opacity-0
                      transition-all
                      duration-300
                      group-hover:translate-x-1
                      group-hover:-translate-y-1
                      group-hover:opacity-100
                    "
                  />
                </a>
              </nav>
            </div>

            {/* ============================================================
                SAY HELLO
                ============================================================= */}

            <div className="min-w-0">
              <p
                className="
                  mb-5
                  text-xs
                  uppercase
                  tracking-[0.12em]
                  text-black/40
                "
              >
                Say hello
              </p>

              <a
                href="mailto:hello@example.com"
                className="
                  group
                  inline-flex
                  max-w-full
                  items-center
                  gap-2
                  text-base
                  font-medium
                "
              >
                <span className="relative min-w-0 truncate">
                  hello@example.com
                  <span
                    className="
                      absolute
                      bottom-0
                      left-0
                      h-px
                      w-full
                      origin-left
                      scale-x-0
                      bg-black
                      transition-transform
                      duration-500
                      group-hover:scale-x-100
                    "
                  />
                </span>

                <ArrowUpRight
                  size={16}
                  className="
                    shrink-0
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                    group-hover:-translate-y-1
                  "
                />
              </a>

              <p className="mt-5 text-xs text-black/40">Available for work</p>
            </div>

            {/* ============================================================
                BACK TO TOP — DESKTOP
                ============================================================= */}

            <div
              className="
                hidden
                min-w-0
                lg:flex
                lg:flex-col
                lg:items-end
              "
            >
              <NeoButton
                variant="global"
                color="secondary"
                size="sm"
                iconHover="up"
                onClick={scrollToTop}
                customIcon={<ArrowUp size={16} />}
                className="
                  inline-flex
                  lg:[&>span]:text-[17px]
                "
                iconClassName="
                  lg:h-[50px]
                  lg:w-[50px]
                "
              >
                GO UP
              </NeoButton>
            </div>
          </div>

          {/* ================================================================
              BOTTOM
              ================================================================= */}

          <div
            className="
              mt-12
              flex
              items-start
              justify-between
              border-t
              border-black/15
              pt-5
              text-xs
              text-black/40
            "
          >
            {/* ============================================================
                COPYRIGHT + CREDIT
                ============================================================= */}

            <div
              className="
                flex
                min-w-0
                flex-col
                gap-2
                lg:contents
              "
            >
              <span>© 2026 — All rights reserved.</span>

              <span className="lg:text-right">
                Designed &amp; Developed with curiosity.
              </span>
            </div>

            {/* ============================================================
                BACK TO TOP — MOBILE
                ============================================================= */}

            <div className="shrink-0 lg:hidden">
              <NeoButton
                variant="global"
                color="secondary"
                size="sm"
                iconHover="up"
                onClick={scrollToTop}
                customIcon={<ArrowUp size={16} />}
                className="inline-flex"
                iconClassName="
                  h-[34px]
                  w-[34px]
                "
              >
                GO UP
              </NeoButton>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
