"use client";

import {
  useLayoutEffect,
  useRef,
  type MouseEvent,
  type KeyboardEvent,
} from "react";

import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StackedScrollItem {
  title: string;
  description: string;
  image?: string;
  color?: string;
  tags?: string[];
  link?: string;
}

interface StackedScrollProps {
  items: StackedScrollItem[];
  className?: string;
}

export default function StackedScroll({
  items,
  className = "",
}: StackedScrollProps) {
  const router = useRouter();

  // ==========================================================================
  // ROOT
  // ==========================================================================

  const rootRef = useRef<HTMLDivElement>(null);

  // ==========================================================================
  // PANEL REFS
  // ==========================================================================

  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dividerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const imageOverlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const viewRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ==========================================================================
  // BREAKPOINT HELPERS
  // ==========================================================================

  const isTouchBreakpoint = () => {
    if (typeof window === "undefined") return true;

    return window.innerWidth < 1024;
  };

  const isMacBreakpoint = () => {
    if (typeof window === "undefined") return false;

    return window.innerWidth >= 1024 && window.innerWidth <= 1280;
  };

  const isLargeDesktop = () => {
    if (typeof window === "undefined") return false;

    return window.innerWidth > 1280;
  };

  // ==========================================================================
  // RESET MOBILE STATE
  // ==========================================================================

  const resetMobileState = () => {
    imageWrapRefs.current.forEach((wrapper) => {
      if (!wrapper) return;

      gsap.killTweensOf(wrapper);

      gsap.set(wrapper, {
        clearProps: "transform,top,left,right,bottom,width,height",
      });
    });

    imageRefs.current.forEach((image) => {
      if (!image) return;

      gsap.killTweensOf(image);

      gsap.set(image, {
        x: 0,
        y: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        skewX: 0,
        skewY: 0,
        transformOrigin: "center center",
      });
    });

    imageOverlayRefs.current.forEach((overlay) => {
      if (!overlay) return;

      gsap.killTweensOf(overlay);

      gsap.set(overlay, {
        opacity: 0,
      });
    });

    viewRefs.current.forEach((view) => {
      if (!view) return;

      gsap.killTweensOf(view);

      gsap.set(view, {
        opacity: 0,
        y: 20,
      });
    });

    contentRefs.current.forEach((content) => {
      if (!content) return;

      gsap.killTweensOf(content);

      gsap.set(content, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      });
    });

    dividerRefs.current.forEach((divider) => {
      if (!divider) return;

      gsap.killTweensOf(divider);

      gsap.set(divider, {
        opacity: 1,
      });
    });
  };

  // ==========================================================================
  // RESET MAC STATE
  // ==========================================================================

  const resetMacState = () => {
    imageRefs.current.forEach((image) => {
      if (!image) return;

      gsap.killTweensOf(image);

      gsap.set(image, {
        x: 0,
        y: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        skewX: 0,
        skewY: 0,
        transformOrigin: "center center",
      });
    });

    imageOverlayRefs.current.forEach((overlay) => {
      if (!overlay) return;

      gsap.killTweensOf(overlay);

      gsap.set(overlay, {
        opacity: 0,
      });
    });

    viewRefs.current.forEach((view) => {
      if (!view) return;

      gsap.killTweensOf(view);

      gsap.set(view, {
        opacity: 0,
        y: 20,
      });
    });
  };

  // ==========================================================================
  // STACKED SCROLL
  // ==========================================================================

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    // ------------------------------------------------------------------------
    // GSAP CONTEXT
    // ------------------------------------------------------------------------

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".stacked-panel");

      if (!panels.length) return;

      // ======================================================================
      // EXTERNAL END POINT
      // ======================================================================

      const endPin = document.querySelector<HTMLElement>(
        "[data-stacked-end-pin]",
      );

      if (!endPin) {
        console.warn("[StackedScroll] [data-stacked-end-pin] was not found.");

        return;
      }

      // ======================================================================
      // MATCH MEDIA
      // ======================================================================

      const mm = gsap.matchMedia();

      // ======================================================================
      // STACKED PIN
      // ======================================================================

      panels.forEach((panel, index) => {
        panelRefs.current[index] = panel;

        ScrollTrigger.create({
          id: `stacked-panel-${index}`,
          trigger: panel,
          start: "top top",
          endTrigger: endPin,
          end: "top top",
          pin: panel,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 10 - index,
          fastScrollEnd: false,
        });
      });

      // ======================================================================
      // FIRST PANEL REVEAL
      // ======================================================================

      mm.add("(min-width: 1024px)", () => {
        const firstPanel = panels[0];

        if (!firstPanel) return;

        const revealContent = firstPanel.querySelector<HTMLDivElement>(
          ".stacked-panel-reveal",
        );

        if (!revealContent) return;

        revealRefs.current[0] = revealContent;

        gsap.fromTo(
          revealContent,
          {
            opacity: 0.1,
            rotate: 3,
            filter: "blur(4px)",
            transformOrigin: "0% 50%",
          },
          {
            opacity: 1,
            rotate: 0,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: firstPanel,
              start: "top 90%",
              end: "top 35%",
              scrub: 1,
              invalidateOnRefresh: true,
              fastScrollEnd: false,
            },
          },
        );
      });

      // ======================================================================
      // MOBILE / TABLET
      // ======================================================================

      mm.add("(max-width: 1023px)", () => {
        resetMobileState();
      });

      // ======================================================================
      // REFRESH
      // ======================================================================

      let resizeTimer: ReturnType<typeof setTimeout> | null = null;

      const refresh = () => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          refresh();
        });
      });

      // ======================================================================
      // WINDOW LOAD
      // ======================================================================

      const handleLoad = () => {
        refresh();
      };

      window.addEventListener("load", handleLoad);

      // ======================================================================
      // RESIZE
      // ======================================================================

      const handleResize = () => {
        const touch = isTouchBreakpoint();
        const mac = isMacBreakpoint();

        if (touch) {
          resetMobileState();
        }

        if (mac) {
          resetMacState();
        }

        if (resizeTimer) {
          clearTimeout(resizeTimer);
        }

        resizeTimer = setTimeout(() => {
          refresh();
        }, 150);
      };

      window.addEventListener("resize", handleResize);

      // ======================================================================
      // CLEANUP CONTEXT
      // ======================================================================

      return () => {
        window.removeEventListener("load", handleLoad);
        window.removeEventListener("resize", handleResize);

        if (resizeTimer) {
          clearTimeout(resizeTimer);
        }

        mm.revert();
      };
    }, root);

    // ------------------------------------------------------------------------
    // CLEANUP
    //
    // Lifecycle Lenis (create/sync/raf/destroy) kini dikelola di
    // `LenisProvider` (lib/lenis-context.tsx), jadi di sini hanya perlu
    // membatalkan konteks GSAP milik komponen ini.
    // ------------------------------------------------------------------------

    return () => {
      ctx.revert();
    };
  }, []);

  // ==========================================================================
  // PANEL CLICK
  // ==========================================================================

  const handlePanelClick = (index: number) => {
    const item = items[index];

    if (!item?.link) return;

    router.push(item.link);
  };

  // ==========================================================================
  // PANEL KEYBOARD
  // ==========================================================================

  const handlePanelKeyDown = (index: number, e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      handlePanelClick(index);
    }
  };

  // ==========================================================================
  // IMAGE ENTER
  // ==========================================================================

  const handleImageEnter = (index: number) => {
    if (isTouchBreakpoint()) return;

    if (isMacBreakpoint()) return;

    const panel = panelRefs.current[index];
    const wrapper = imageWrapRefs.current[index];
    const image = imageRefs.current[index];
    const overlay = imageOverlayRefs.current[index];
    const view = viewRefs.current[index];
    const content = contentRefs.current[index];
    const divider = dividerRefs.current[index];

    if (!panel || !wrapper || !image) return;

    gsap.killTweensOf([wrapper, image, overlay, view, content, divider]);

    // ========================================================================
    // HIDE CONTENT
    // ========================================================================

    if (content) {
      gsap.to(content, {
        opacity: 0,
        y: 30,
        filter: "blur(8px)",
        duration: 0.5,
        ease: "power3.out",
        overwrite: true,
      });
    }

    // ========================================================================
    // HIDE DIVIDER
    // ========================================================================

    if (divider) {
      gsap.to(divider, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    }

    // ========================================================================
    // LARGE DESKTOP
    // ========================================================================

    if (isLargeDesktop()) {
      gsap.to(wrapper, {
        top: 0,
        bottom: "auto",
        left: 0,
        right: "auto",
        width: "100%",
        height: "80%",
        duration: 0.95,
        ease: "power4.inOut",
        overwrite: true,
      });

      gsap.to(image, {
        x: 0,
        y: 0,
        scale: 1.08,
        rotateX: 0,
        rotateY: 0,
        skewX: 0,
        skewY: 0,
        transformOrigin: "center center",
        duration: 1,
        ease: "power4.out",
        overwrite: true,
      });

      if (overlay) {
        gsap.to(overlay, {
          opacity: 0.3,
          duration: 0.55,
          ease: "power2.out",
          overwrite: true,
        });
      }

      if (view) {
        gsap.to(view, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          delay: 0.15,
          ease: "power3.out",
          overwrite: true,
        });
      }
    }
  };

  // ==========================================================================
  // IMAGE MOVE
  // ==========================================================================

  const handleImageMove = (index: number, e: MouseEvent<HTMLDivElement>) => {
    if (isTouchBreakpoint()) return;

    if (isMacBreakpoint()) return;

    const wrapper = imageWrapRefs.current[index];
    const image = imageRefs.current[index];

    if (!wrapper || !image) return;

    const rect = wrapper.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) return;

    const x = (e.clientX - rect.left) / rect.width - 0.5;

    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(image, {
      x: x * 18,
      y: y * 18,
      rotateX: y * -2,
      rotateY: x * 2,
      skewX: x * 0.8,
      skewY: y * 0.8,
      duration: 0.55,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  // ==========================================================================
  // IMAGE LEAVE
  // ==========================================================================

  const handleImageLeave = (index: number) => {
    const wrapper = imageWrapRefs.current[index];
    const image = imageRefs.current[index];
    const overlay = imageOverlayRefs.current[index];
    const view = viewRefs.current[index];
    const content = contentRefs.current[index];
    const divider = dividerRefs.current[index];

    if (!wrapper || !image) return;

    gsap.killTweensOf([wrapper, image, overlay, view, content, divider]);

    // ========================================================================
    // MOBILE / TABLET
    // ========================================================================

    if (isTouchBreakpoint()) {
      gsap.set(wrapper, {
        clearProps: "transform,top,left,right,bottom,width,height",
      });

      gsap.set(image, {
        x: 0,
        y: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        skewX: 0,
        skewY: 0,
        transformOrigin: "center center",
      });

      if (overlay) {
        gsap.set(overlay, {
          opacity: 0,
        });
      }

      if (view) {
        gsap.set(view, {
          opacity: 0,
          y: 20,
        });
      }

      if (content) {
        gsap.set(content, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        });
      }

      if (divider) {
        gsap.set(divider, {
          opacity: 1,
        });
      }

      return;
    }

    // ========================================================================
    // MAC / SMALL DESKTOP
    // ========================================================================

    if (isMacBreakpoint()) {
      return;
    }

    // ========================================================================
    // SHOW CONTENT
    // ========================================================================

    if (content) {
      gsap.to(content, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.65,
        delay: 0.45,
        ease: "power3.out",
        overwrite: true,
      });
    }

    // ========================================================================
    // SHOW DIVIDER
    // ========================================================================

    if (divider) {
      gsap.to(divider, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
      });
    }

    // ========================================================================
    // LARGE DESKTOP
    // ========================================================================

    if (isLargeDesktop()) {
      gsap.to(wrapper, {
        top: 0,
        bottom: "auto",
        left: "50%",
        right: "auto",
        width: "50%",
        height: "48vh",
        duration: 0.9,
        ease: "power4.inOut",
        overwrite: true,
      });
    }

    // ========================================================================
    // RESET IMAGE
    // ========================================================================

    gsap.to(image, {
      x: 0,
      y: 0,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      skewX: 0,
      skewY: 0,
      transformOrigin: "center center",
      duration: 0.9,
      ease: "power4.out",
      overwrite: true,
    });

    // ========================================================================
    // RESET OVERLAY
    // ========================================================================

    if (overlay) {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
      });
    }

    // ========================================================================
    // RESET IMAGE CTA
    // ========================================================================

    if (view) {
      gsap.to(view, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: "power2.out",
        overwrite: true,
      });
    }
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div ref={rootRef} className={`relative w-full ${className}`}>
      {/* ====================================================================
          PANEL LIST
      ==================================================================== */}

      <div className="panel-list relative w-full">
        {items.map((item, index) => (
          <section
            key={`${item.title}-${index}`}
            ref={(el) => {
              panelRefs.current[index] = el;
            }}
            data-cursor="project"
            className="
              stacked-panel
              relative
              flex
              min-h-screen
              w-full
              items-start
              overflow-hidden
              bg-black
              text-white
              cursor-pointer
              will-change-transform
            "
            onClick={() => handlePanelClick(index)}
            onKeyDown={(e) => handlePanelKeyDown(index, e)}
            role="link"
            tabIndex={0}
          >
            {/* ============================================================
                REVEAL
            ============================================================ */}

            <div
              ref={(el) => {
                revealRefs.current[index] = el;
              }}
              className="
                stacked-panel-reveal
                relative
                min-h-screen
                w-full
              "
            >
              {/* ==========================================================
                  DIVIDER
              ========================================================== */}

              <div
                ref={(el) => {
                  dividerRefs.current[index] = el;
                }}
                className="
                  mb-10
                  mt-8
                  h-px
                  w-full
                  bg-white/20
                  md:mb-12
                  md:mt-16
                "
              />

              {/* ==========================================================
                  CONTENT AREA
              ========================================================== */}

              <div
                className="
                  stacked-content-area
                  relative
                  min-h-screen
                  w-full
                  pb-10
                  min-[1024px]:pb-0
                "
              >
                {/* ========================================================
                    TEXT
                ======================================================== */}

                <div
                  ref={(el) => {
                    contentRefs.current[index] = el;
                  }}
                  className="
                    relative
                    z-[10]
                    flex
                    w-full
                    flex-col
                    items-start
                    will-change-transform
                    text-white
                    min-[1281px]:w-1/2
                  "
                >
                  <div className="w-full">
                    <h3
                      className="
                        text-3xl
                        font-aeonik
                        font-regular
                        leading-[0.95]
                        tracking-[-0.04em]
                        md:text-6xl
                        min-[1281px]:max-w-xl
                        min-[1281px]:text-5xl
                      "
                    >
                      {item.title}
                    </h3>

                    <p
                      className="
                        mt-8
                        w-full
                        text-base
                        leading-[1.6]
                        text-white/60
                        md:mt-10
                        md:text-xl
                        min-[1281px]:max-w-xl
                        hover:text-white
                      "
                    >
                      {item.description}
                    </p>

                    {item.tags && item.tags.length > 0 && (
                      <div
                        className="
                          mt-8
                          flex
                          flex-wrap
                          items-center
                          gap-2
                          md:mt-10
                        "
                      >
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="
                              rounded-xl
                              border
                              border-neutral-500
                              px-3
                              py-1.5
                              text-xs
                              font-light
                              text-neutral-400
                            "
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ========================================================
                    IMAGE
                ======================================================== */}

                {item.image && (
                  <div
                    ref={(el) => {
                      imageWrapRefs.current[index] = el;
                    }}
                    className="
                      group/project-image
                      relative
                      z-[5]
                      isolate
                      mt-10
                      block
                      h-[48vh]
                      w-full
                      overflow-hidden
                      rounded-2xl
                      [perspective:1000px]
                      will-change-[width,left,height,top,bottom]
                      min-[1024px]:absolute
                      min-[1024px]:max-[1280px]:left-0
                      min-[1024px]:max-[1280px]:bottom-0
                      min-[1024px]:max-[1280px]:top-auto
                      min-[1024px]:max-[1280px]:mt-0
                      min-[1024px]:max-[1280px]:h-[48vh]
                      min-[1024px]:max-[1280px]:w-full
                      min-[1281px]:absolute
                      min-[1281px]:right-0
                      min-[1281px]:top-0
                      min-[1281px]:mt-0
                      min-[1281px]:h-[48vh]
                      min-[1281px]:w-1/2
                    "
                    onMouseEnter={() => handleImageEnter(index)}
                    onMouseMove={(e) => handleImageMove(index, e)}
                    onMouseLeave={() => handleImageLeave(index)}
                  >
                    {/* ====================================================
                        IMAGE
                    ==================================================== */}

                    <div
                      className="
                        absolute
                        inset-0
                        flex
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-[inherit]
                      "
                    >
                      <img
                        ref={(el) => {
                          imageRefs.current[index] = el;
                        }}
                        src={item.image}
                        alt={item.title}
                        className="
                          block
                          h-full
                          w-full
                          select-none
                          object-cover
                          object-center
                          transform-gpu
                          will-change-transform
                        "
                        draggable={false}
                      />
                    </div>

                    {/* ====================================================
                        OVERLAY
                    ==================================================== */}

                    <div
                      ref={(el) => {
                        imageOverlayRefs.current[index] = el;
                      }}
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        z-[10]
                        bg-black
                        opacity-0
                        mix-blend-multiply
                      "
                    />

                    {/* ====================================================
                        IMAGE CTA
                    ==================================================== */}

                    <div
                      ref={(el) => {
                        viewRefs.current[index] = el;
                      }}
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        z-[20]
                        flex
                        translate-y-5
                        items-end
                        justify-between
                        p-6
                        opacity-0
                        md:p-10
                      "
                    >
                      <div className="flex flex-col gap-3">
                        <h3
                          className="
                            text-xl
                            font-medium
                            leading-[1]
                            tracking-[-0.03em]
                            text-white
                            drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]
                            md:text-3xl
                          "
                        >
                          {item.title}
                        </h3>

                        <p
                          className="
                            max-w-2xl
                            text-sm
                            font-normal
                            leading-[1.5]
                            text-white/70
                            drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]
                            md:text-base
                          "
                        >
                          {item.description}
                        </p>
                      </div>

                      <span
                        className="
                          flex
                          h-12
                          w-12
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-white/50
                          bg-black/20
                          text-xl
                          text-white
                          backdrop-blur-sm
                        "
                      >
                        ↗
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
