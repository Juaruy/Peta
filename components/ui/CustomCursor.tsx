"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const isProjectRef = useRef(false);
  const isSelectingRef = useRef(false);
  const isReadyRef = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const inner = innerRef.current;
    const marquee = marqueeRef.current;

    if (!cursor || !inner || !marquee) return;

    // ================================================================
    // TRUE NEGATIVE SELECTION
    // ================================================================

    const selectionStyleId = "custom-cursor-selection-style";

    let selectionStyle = document.getElementById(
      selectionStyleId,
    ) as HTMLStyleElement | null;

    if (!selectionStyle) {
      selectionStyle = document.createElement("style");
      selectionStyle.id = selectionStyleId;
      document.head.appendChild(selectionStyle);
    }

    const parseRGB = (value: string) => {
      const match = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);

      if (!match) return null;

      return {
        r: Number(match[1]),
        g: Number(match[2]),
        b: Number(match[3]),
      };
    };

    const invertRGB = (rgb: { r: number; g: number; b: number }) => {
      return {
        r: 255 - rgb.r,
        g: 255 - rgb.g,
        b: 255 - rgb.b,
      };
    };

    const rgbToString = (rgb: { r: number; g: number; b: number }) => {
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    };

    const isTransparent = (value: string) => {
      return (
        value === "transparent" ||
        value === "rgba(0, 0, 0, 0)" ||
        value === "rgba(0,0,0,0)"
      );
    };

    // --------------------------------------------------------------
    // FIND ACTUAL BACKGROUND
    // --------------------------------------------------------------

    const getEffectiveBackground = (element: HTMLElement) => {
      let current: HTMLElement | null = element;

      while (current) {
        const styles = window.getComputedStyle(current);
        const backgroundColor = styles.backgroundColor;

        if (!isTransparent(backgroundColor)) {
          const rgb = parseRGB(backgroundColor);

          if (rgb) {
            return rgb;
          }
        }

        current = current.parentElement;
      }

      // Fallback to body
      const bodyStyles = window.getComputedStyle(document.body);
      const bodyBackground = parseRGB(bodyStyles.backgroundColor);

      if (bodyBackground) {
        return bodyBackground;
      }

      // Final fallback: white
      return {
        r: 255,
        g: 255,
        b: 255,
      };
    };

    // --------------------------------------------------------------
    // APPLY TRUE NEGATIVE SELECTION
    // --------------------------------------------------------------

    const updateSelectionStyle = () => {
      const selection = window.getSelection();

      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        return;
      }

      const range = selection.getRangeAt(0);

      const startElement =
        range.startContainer.nodeType === Node.ELEMENT_NODE
          ? (range.startContainer as HTMLElement)
          : range.startContainer.parentElement;

      if (!startElement) return;

      const textStyles = window.getComputedStyle(startElement);

      const textColor = parseRGB(textStyles.color);

      if (!textColor) return;

      const backgroundColor = getEffectiveBackground(startElement);

      const negativeText = invertRGB(textColor);
      const negativeBackground = invertRGB(backgroundColor);

      selectionStyle!.textContent = `
        ::selection {
          background-color: ${rgbToString(negativeBackground)} !important;
          color: ${rgbToString(negativeText)} !important;
        }

        ::-moz-selection {
          background-color: ${rgbToString(negativeBackground)} !important;
          color: ${rgbToString(negativeText)} !important;
        }
      `;
    };

    // --------------------------------------------------------------
    // RESET SELECTION STYLE
    // --------------------------------------------------------------

    const resetSelectionStyle = () => {
      selectionStyle!.textContent = `
        ::selection {
          background-color: transparent !important;
          color: inherit !important;
        }

        ::-moz-selection {
          background-color: transparent !important;
          color: inherit !important;
        }
      `;
    };

    resetSelectionStyle();

    // ================================================================
    // INITIAL STATE
    // ================================================================

    isReadyRef.current = false;
    isProjectRef.current = false;
    isSelectingRef.current = false;

    gsap.killTweensOf([cursor, inner, marquee]);

    gsap.set(cursor, {
      x: -100,
      y: -100,
      width: 12,
      height: 12,
      borderRadius: 4,
      rotation: 0,
      opacity: 0,
      backgroundColor: "#ffffff",
      color: "#ffffff",
      mixBlendMode: "difference",
      force3D: true,
    });

    gsap.set(inner, {
      opacity: 0,
      scale: 0.8,
      force3D: true,
    });

    gsap.set(marquee, {
      xPercent: 0,
      force3D: true,
    });

    // --------------------------------------------------------------
    // MARK AS READY
    // --------------------------------------------------------------

    isReadyRef.current = true;

    // ================================================================
    // PROJECT → DEFAULT
    // ================================================================

    const setDefaultCursor = () => {
      if (!isReadyRef.current) return;
      if (!isProjectRef.current) return;

      isProjectRef.current = false;

      gsap.killTweensOf([cursor, inner, marquee]);

      // --------------------------------------------------------------
      // RESTORE DEFAULT STATE
      // --------------------------------------------------------------

      gsap.set(cursor, {
        mixBlendMode: "difference",
        backgroundColor: "#ffffff",
        color: "#ffffff",
        rotation: 0,
      });

      // --------------------------------------------------------------
      // HIDE VIEW PROJECT
      // --------------------------------------------------------------

      gsap.to(inner, {
        opacity: 0,
        scale: 0.8,
        duration: 0.18,
        ease: "power2.in",
        overwrite: true,
      });

      // --------------------------------------------------------------
      // RESET MARQUEE
      // --------------------------------------------------------------

      gsap.to(marquee, {
        xPercent: 0,
        duration: 0.25,
        ease: "power2.out",
        overwrite: true,
      });

      // --------------------------------------------------------------
      // CURSOR → DEFAULT
      // --------------------------------------------------------------

      gsap.to(cursor, {
        width: 12,
        height: 12,
        borderRadius: 4,
        rotation: 0,
        duration: 0.4,
        ease: "power4.inOut",
        overwrite: true,
      });
    };

    // ================================================================
    // DEFAULT → PROJECT
    // ================================================================

    const setProjectCursor = () => {
      if (!isReadyRef.current) return;
      if (isProjectRef.current) return;
      if (isSelectingRef.current) return;

      isProjectRef.current = true;

      gsap.killTweensOf([cursor, inner, marquee]);

      // --------------------------------------------------------------
      // PROJECT BLEND MODE
      // --------------------------------------------------------------

      gsap.set(cursor, {
        mixBlendMode: "normal",
        backgroundColor: "#ffffff",
        color: "#000000",
        rotation: 0,
      });

      // --------------------------------------------------------------
      // CURSOR SIZE
      // --------------------------------------------------------------

      gsap.to(cursor, {
        width: 144,
        height: 44,
        borderRadius: 8,
        rotation: 0,
        duration: 0.45,
        ease: "power4.inOut",
        overwrite: true,
      });

      // --------------------------------------------------------------
      // VIEW PROJECT REVEAL
      // --------------------------------------------------------------

      gsap.fromTo(
        inner,
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          delay: 0.08,
          ease: "power3.out",
          overwrite: true,
        },
      );

      // --------------------------------------------------------------
      // MARQUEE
      // --------------------------------------------------------------

      gsap.set(marquee, {
        xPercent: 0,
      });

      gsap.to(marquee, {
        xPercent: -50,
        duration: 8,
        ease: "none",
        repeat: -1,
        overwrite: true,
      });
    };

    // ================================================================
    // SELECTION → TRUE NEGATIVE CURSOR
    // ================================================================

    const setSelectionCursor = () => {
      if (!isReadyRef.current) return;

      const selection = window.getSelection();

      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        return;
      }

      // --------------------------------------------------------------
      // UPDATE NATIVE TEXT SELECTION COLORS
      // --------------------------------------------------------------

      updateSelectionStyle();

      if (isSelectingRef.current) return;

      isSelectingRef.current = true;

      // --------------------------------------------------------------
      // CANCEL PROJECT STATE VISUALLY
      // --------------------------------------------------------------

      isProjectRef.current = false;

      gsap.killTweensOf([cursor, inner, marquee]);

      // --------------------------------------------------------------
      // FORCE NEGATIVE CURSOR
      // --------------------------------------------------------------

      gsap.set(cursor, {
        mixBlendMode: "difference",
        backgroundColor: "#ffffff",
        color: "#ffffff",
        rotation: 0,
      });

      // --------------------------------------------------------------
      // HIDE VIEW PROJECT
      // --------------------------------------------------------------

      gsap.to(inner, {
        opacity: 0,
        scale: 0.8,
        duration: 0.15,
        ease: "power2.in",
        overwrite: true,
      });

      // --------------------------------------------------------------
      // RESET MARQUEE
      // --------------------------------------------------------------

      gsap.to(marquee, {
        xPercent: 0,
        duration: 0.2,
        ease: "power2.out",
        overwrite: true,
      });

      // --------------------------------------------------------------
      // SHRINK TO DEFAULT
      // --------------------------------------------------------------

      gsap.to(cursor, {
        width: 12,
        height: 12,
        borderRadius: 4,
        rotation: 0,
        duration: 0.25,
        ease: "power3.out",
        overwrite: true,
      });
    };

    // ================================================================
    // SELECTION → NORMAL
    // ================================================================

    const clearSelectionState = () => {
      if (!isSelectingRef.current) return;

      const selection = window.getSelection();

      // Still selecting something
      if (selection && !selection.isCollapsed && selection.toString().trim()) {
        updateSelectionStyle();
        return;
      }

      isSelectingRef.current = false;

      // --------------------------------------------------------------
      // RESET NATIVE SELECTION STYLE
      // --------------------------------------------------------------

      resetSelectionStyle();

      // --------------------------------------------------------------
      // RESTORE DEFAULT CURSOR
      // --------------------------------------------------------------

      gsap.set(cursor, {
        mixBlendMode: "difference",
        backgroundColor: "#ffffff",
        color: "#ffffff",
        rotation: 0,
      });

      gsap.set(inner, {
        opacity: 0,
        scale: 0.8,
      });

      gsap.set(marquee, {
        xPercent: 0,
      });

      gsap.to(cursor, {
        width: 12,
        height: 12,
        borderRadius: 4,
        rotation: 0,
        duration: 0.2,
        ease: "power3.out",
        overwrite: true,
      });
    };

    // ================================================================
    // DETECT CURRENT TARGET
    // ================================================================

    const updateCursorState = (clientX: number, clientY: number) => {
      if (!isReadyRef.current) return false;

      // Selection always takes priority over project hover.
      if (isSelectingRef.current) {
        return false;
      }

      const target = document.elementFromPoint(
        clientX,
        clientY,
      ) as HTMLElement | null;

      const projectTarget = target?.closest('[data-cursor="project"]');

      const shouldShowProject = Boolean(projectTarget);

      // --------------------------------------------------------------
      // ENTER PROJECT
      // --------------------------------------------------------------

      if (shouldShowProject) {
        if (!isProjectRef.current) {
          setProjectCursor();
        }

        return true;
      }

      // --------------------------------------------------------------
      // LEAVE PROJECT
      // --------------------------------------------------------------

      if (isProjectRef.current) {
        setDefaultCursor();
      }

      return false;
    };

    // ================================================================
    // MOUSE MOVE
    // ================================================================

    const handleMouseMove = (e: MouseEvent) => {
      if (!isReadyRef.current) return;

      const isProject = updateCursorState(e.clientX, e.clientY);

      // --------------------------------------------------------------
      // CURSOR FOLLOW
      // --------------------------------------------------------------

      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY - (isProject ? 10 : 0),
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
        force3D: true,
      });

      // --------------------------------------------------------------
      // SHOW CURSOR AFTER FIRST REAL MOUSE MOVE
      // --------------------------------------------------------------

      if (gsap.getProperty(cursor, "opacity") !== 1) {
        gsap.to(cursor, {
          opacity: 1,
          duration: 0.15,
          ease: "power2.out",
          overwrite: true,
        });
      }
    };

    // ================================================================
    // MOUSE DOWN
    // ================================================================

    const handleMouseDown = () => {
      requestAnimationFrame(() => {
        const selection = window.getSelection();

        if (
          selection &&
          !selection.isCollapsed &&
          selection.toString().trim()
        ) {
          setSelectionCursor();
        }
      });
    };

    // ================================================================
    // SELECTION CHANGE
    // ================================================================

    const handleSelectionChange = () => {
      const selection = window.getSelection();

      if (selection && !selection.isCollapsed && selection.toString().trim()) {
        setSelectionCursor();
      } else {
        clearSelectionState();
      }
    };

    // ================================================================
    // MOUSE UP
    // ================================================================

    const handleMouseUp = () => {
      requestAnimationFrame(() => {
        const selection = window.getSelection();

        if (
          selection &&
          !selection.isCollapsed &&
          selection.toString().trim()
        ) {
          setSelectionCursor();
        } else {
          clearSelectionState();
        }
      });
    };

    // ================================================================
    // MOUSE LEAVE WINDOW
    // ================================================================

    const handleMouseLeave = () => {
      if (!isReadyRef.current) return;

      isProjectRef.current = false;
      isSelectingRef.current = false;

      resetSelectionStyle();

      gsap.killTweensOf([cursor, inner, marquee]);

      // --------------------------------------------------------------
      // FULL RESET
      // --------------------------------------------------------------

      gsap.set(cursor, {
        mixBlendMode: "difference",
        width: 12,
        height: 12,
        borderRadius: 4,
        rotation: 0,
        backgroundColor: "#ffffff",
        color: "#ffffff",
      });

      gsap.set(inner, {
        opacity: 0,
        scale: 0.8,
      });

      gsap.set(marquee, {
        xPercent: 0,
      });

      // --------------------------------------------------------------
      // HIDE
      // --------------------------------------------------------------

      gsap.to(cursor, {
        opacity: 0,
        duration: 0.15,
        ease: "power2.out",
        overwrite: true,
      });
    };

    // ================================================================
    // MOUSE ENTER WINDOW
    // ================================================================

    const handleMouseEnter = (e: MouseEvent) => {
      if (!isReadyRef.current) return;

      const isProject = updateCursorState(e.clientX, e.clientY);

      // --------------------------------------------------------------
      // SET POSITION DIRECTLY
      // Prevents visible jump/stretch when re-entering.
      // --------------------------------------------------------------

      gsap.set(cursor, {
        x: e.clientX,
        y: e.clientY - (isProject ? 10 : 0),
      });

      // --------------------------------------------------------------
      // SHOW
      // --------------------------------------------------------------

      gsap.to(cursor, {
        opacity: 1,
        duration: 0.15,
        ease: "power2.out",
        overwrite: true,
      });
    };

    // ================================================================
    // EVENTS
    // ================================================================

    window.addEventListener("mousemove", handleMouseMove);

    window.addEventListener("mousedown", handleMouseDown);

    window.addEventListener("mouseup", handleMouseUp);

    document.addEventListener("selectionchange", handleSelectionChange);

    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    // ================================================================
    // CLEANUP
    // ================================================================

    return () => {
      isReadyRef.current = false;

      window.removeEventListener("mousemove", handleMouseMove);

      window.removeEventListener("mousedown", handleMouseDown);

      window.removeEventListener("mouseup", handleMouseUp);

      document.removeEventListener("selectionchange", handleSelectionChange);

      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave,
      );

      document.documentElement.removeEventListener(
        "mouseenter",
        handleMouseEnter,
      );

      gsap.killTweensOf([cursor, inner, marquee]);

      selectionStyle?.remove();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="
        pointer-events-none
        fixed
        left-0
        top-0
        hidden
        min-[1024px]:flex
        z-[999999999]
        items-center
        justify-center
        overflow-hidden
        bg-white
        text-white
        mix-blend-difference
        will-change-[transform,width,height]
      "
      style={{
        transform: "translate3d(-50%, -50%, 0)",
        opacity: 0,
      }}
    >
      <div
        ref={innerRef}
        className="
          pointer-events-none
          flex
          h-full
          w-full
          items-center
          overflow-hidden
        "
      >
        <div
          ref={marqueeRef}
          className="
            flex
            w-max
            shrink-0
            whitespace-nowrap
            will-change-transform
          "
        >
          {/* ============================================================
              MARQUEE GROUP 1
          ============================================================ */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-6
              pr-6
            "
          >
            <span
              className="
                text-lg
                font-semibold
                uppercase
                tracking-[0.12em]
              "
            >
              View Project
            </span>

            <span
              className="
                text-lg
                font-semibold
                uppercase
                tracking-[0.12em]
              "
            >
              View Project
            </span>

            <span
              className="
                text-lg
                font-semibold
                uppercase
                tracking-[0.12em]
              "
            >
              View Project
            </span>
          </div>

          {/* ============================================================
              MARQUEE GROUP 2
          ============================================================ */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-6
              pr-6
            "
          >
            <span
              className="
                text-lg
                font-semibold
                uppercase
                tracking-[0.12em]
              "
            >
              View Project
            </span>

            <span
              className="
                text-lg
                font-semibold
                uppercase
                tracking-[0.12em]
              "
            >
              View Project
            </span>

            <span
              className="
                text-lg
                font-semibold
                uppercase
                tracking-[0.12em]
              "
            >
              View Project
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
