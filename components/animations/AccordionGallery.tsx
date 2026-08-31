import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { gsap } from "gsap";

export interface AccordionGalleryItem {
  image?: string;
  color?: string;
  title?: string;
  description?: string;
  link?: string;
  alt?: string;
}

export interface AccordionGalleryProps {
  items?: AccordionGalleryItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: "horizontal" | "vertical";
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: "hover" | "click";
  showContent?: boolean;
  grayscale?: boolean;
  className?: string;

  // Border Glow
  glowEnabled?: boolean;
  glowEdgeSensitivity?: number;
  glowColor?: string;
  glowBackgroundColor?: string;
  glowRadius?: number;
  glowIntensity?: number;
  glowConeSpread?: number;
  glowColors?: string[];
  glowFillOpacity?: number;
}

/* -------------------------------------------------------------------------- */
/* DEFAULT ITEMS                                                              */
/* -------------------------------------------------------------------------- */

const DEFAULT_ITEMS: AccordionGalleryItem[] = [
  {
    image: "https://picsum.photos/id/1015/900/1200",
    title: "Canyon",
    description: "Explore the beauty of the canyon landscape.",
    link: "#",
  },
  {
    image: "https://picsum.photos/id/1018/900/1200",
    title: "Ridgeline",
    description: "A scenic view from above the ridgeline.",
    link: "#",
  },
  {
    image: "https://picsum.photos/id/1039/900/1200",
    title: "Falls",
    description: "Discover the calm and powerful beauty of the falls.",
    link: "#",
  },
  {
    image: "https://picsum.photos/id/1043/900/1200",
    title: "Harbour",
    description: "A peaceful harbour surrounded by the city.",
    link: "#",
  },
  {
    image: "https://picsum.photos/id/1044/900/1200",
    title: "Skyline",
    description: "A panoramic view of the city skyline.",
    link: "#",
  },
];

/* -------------------------------------------------------------------------- */
/* BORDER GLOW HELPERS                                                        */
/* -------------------------------------------------------------------------- */

function parseHSL(hslStr: string): {
  h: number;
  s: number;
  l: number;
} {
  const match = hslStr.match(/([\d.]+)\s+([\d.]+)%?\s+([\d.]+)%?/);

  if (!match) {
    return {
      h: 40,
      s: 80,
      l: 80,
    };
  }

  return {
    h: Number.parseFloat(match[1]),
    s: Number.parseFloat(match[2]),
    l: Number.parseFloat(match[3]),
  };
}

function buildBoxShadow(glowColor: string, intensity: number): string {
  const { h, s, l } = parseHSL(glowColor);

  const base = `${h}deg ${s}% ${l}%`;

  const layers: [number, number, number, number, number, boolean][] = [
    [0, 0, 0, 1, 100, true],
    [0, 0, 1, 0, 60, true],
    [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true],
    [0, 0, 15, 0, 30, true],
    [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],

    [0, 0, 1, 0, 60, false],
    [0, 0, 3, 0, 50, false],
    [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false],
    [0, 0, 25, 2, 20, false],
    [0, 0, 50, 2, 10, false],
  ];

  return layers
    .map(([x, y, blur, spread, alpha, inset]) => {
      const opacity = Math.min(alpha * intensity, 100);

      return `${
        inset ? "inset " : ""
      }${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${opacity}%)`;
    })
    .join(", ");
}

const GRADIENT_POSITIONS = [
  "80% 55%",
  "69% 34%",
  "8% 6%",
  "41% 38%",
  "86% 85%",
  "82% 18%",
  "51% 4%",
];

const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildMeshGradients(colors: string[]): string[] {
  const safeColors = colors.length > 0 ? colors : ["#c084fc"];

  const gradients: string[] = [];

  for (let i = 0; i < 7; i++) {
    const color = safeColors[Math.min(COLOR_MAP[i], safeColors.length - 1)];

    gradients.push(
      `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${color} 0px, transparent 50%)`,
    );
  }

  gradients.push(`linear-gradient(${safeColors[0]} 0 100%)`);

  return gradients;
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

const AccordionGallery = ({
  items = DEFAULT_ITEMS,
  defaultIndex = 2,

  accentColor = "#ffffff",
  overlayColor = "#060010",
  textColor = "#ffffff",

  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,

  orientation = "horizontal",

  duration = 0.6,
  ease = "power3.out",
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,

  trigger = "hover",
  showContent = true,
  grayscale = true,

  className = "",

  /* ------------------------------ GLOW ---------------------------------- */

  glowEnabled = true,
  glowEdgeSensitivity = 30,
  glowColor = "40 80 80",
  glowBackgroundColor = "#120F17",
  glowRadius = 40,
  glowIntensity = 1,
  glowConeSpread = 25,
  glowColors = ["#c084fc", "#f472b6", "#38bdf8"],
  glowFillOpacity = 0.5,
}: AccordionGalleryProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const panelRefs = useRef<(HTMLElement | null)[]>([]);

  const mediaRefs = useRef<(HTMLElement | null)[]>([]);

  const collapsedTitleRefs = useRef<(HTMLElement | null)[]>([]);

  const expandedContentRefs = useRef<(HTMLElement | null)[]>([]);

  const lineRefs = useRef<(HTMLElement | null)[]>([]);

  const spotlightRefs = useRef<(HTMLDivElement | null)[]>([]);

  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const firstRunRef = useRef(true);

  const mediaSizeRef = useRef(320);

  const vertical = orientation === "vertical";

  const count = items.length;

  const [active, setActive] = useState(() =>
    count > 0 ? Math.min(Math.max(defaultIndex, 0), count - 1) : 0,
  );

  const [isMobile, setIsMobile] = useState(false);

  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const [glowStates, setGlowStates] = useState<
    {
      angle: number;
      proximity: number;
      visible: boolean;
    }[]
  >(() =>
    items.map(() => ({
      angle: 45,
      proximity: 0,
      visible: false,
    })),
  );

  const prefersReduced =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  /* ---------------------------------------------------------------------- */
  /* MOBILE                                                                 */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 520);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  /* ---------------------------------------------------------------------- */
  /* GLOW HELPERS                                                            */
  /* ---------------------------------------------------------------------- */

  const getCenterOfElement = useCallback((el: HTMLElement) => {
    const { width, height } = el.getBoundingClientRect();

    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback(
    (el: HTMLElement, x: number, y: number) => {
      const [cx, cy] = getCenterOfElement(el);

      const dx = x - cx;
      const dy = y - cy;

      let kx = Infinity;
      let ky = Infinity;

      if (dx !== 0) {
        kx = cx / Math.abs(dx);
      }

      if (dy !== 0) {
        ky = cy / Math.abs(dy);
      }

      const minK = Math.min(kx, ky);

      if (!Number.isFinite(minK)) {
        return 0;
      }

      return Math.min(Math.max(1 / minK, 0), 1);
    },
    [getCenterOfElement],
  );

  const getCursorAngle = useCallback(
    (el: HTMLElement, x: number, y: number) => {
      const [cx, cy] = getCenterOfElement(el);

      const dx = x - cx;
      const dy = y - cy;

      if (dx === 0 && dy === 0) {
        return 0;
      }

      const radians = Math.atan2(dy, dx);

      let degrees = radians * (180 / Math.PI) + 90;

      if (degrees < 0) {
        degrees += 360;
      }

      return degrees;
    },
    [getCenterOfElement],
  );

  const updateGlowState = useCallback(
    (
      index: number,
      next: Partial<{
        angle: number;
        proximity: number;
        visible: boolean;
      }>,
    ) => {
      setGlowStates((previous) => {
        const result = [...previous];

        result[index] = {
          ...result[index],
          ...next,
        };

        return result;
      });
    },
    [],
  );

  const handleGlowMove = useCallback(
    (index: number, e: PointerEvent<HTMLElement>) => {
      if (!glowEnabled || isMobile) {
        return;
      }

      const card = panelRefs.current[index];

      if (!card) {
        return;
      }

      const rect = card.getBoundingClientRect();

      const x = e.clientX - rect.left;

      const y = e.clientY - rect.top;

      const proximity = getEdgeProximity(card, x, y);

      const angle = getCursorAngle(card, x, y);

      updateGlowState(index, {
        angle,
        proximity,
        visible: true,
      });
    },
    [glowEnabled, isMobile, getEdgeProximity, getCursorAngle, updateGlowState],
  );

  const handleGlowLeave = useCallback(
    (index: number) => {
      updateGlowState(index, {
        proximity: 0,
        visible: false,
      });
    },
    [updateGlowState],
  );

  /* ---------------------------------------------------------------------- */
  /* OVERLAY                                                                 */
  /* ---------------------------------------------------------------------- */

  const overlayBg = `
    linear-gradient(
      180deg,
      transparent 35%,
      color-mix(
        in srgb,
        ${overlayColor} 85%,
        transparent
      ) 100%
    ),
    color-mix(
      in srgb,
      ${overlayColor}
      calc(var(--ag-dim, 0.35) * 100%),
      transparent
    )
  `;

  /* ---------------------------------------------------------------------- */
  /* GSAP LAYOUT                                                             */
  /* ---------------------------------------------------------------------- */

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;

      if (!panels.length) {
        return;
      }

      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);

      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;

      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();

      const dur = animate && !prefersReduced ? duration : 0;

      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) {
          return;
        }

        const isActive = isMobile ? true : i === active;

        const media = mediaRefs.current[i];

        const collapsedTitle = collapsedTitleRefs.current[i];

        const expandedContent = expandedContentRefs.current[i];

        const line = lineRefs.current[i];

        const rot = isMobile ? 0 : isActive ? 0 : i < active ? tilt : -tilt;

        const rotProp = vertical
          ? {
              rotateX: -rot,
            }
          : {
              rotateY: rot,
            };
        tl.to(
          panel,
          {
            flexGrow: isMobile ? 0 : isActive ? grow : 1,
            opacity: 1,
            ...rotProp,
            duration: dur,
            ease,
          },
          0,
        );

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));

          const shift = drift * parallax * mediaSize * 0.06;

          const gray = isMobile ? 0 : grayscale ? (isActive ? 0 : 1) : 0;

          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,

              x: vertical ? 0 : isActive ? 0 : shift,

              y: vertical ? (isActive ? 0 : shift) : 0,

              "--ag-gray": gray,

              "--ag-dim": isMobile ? 0 : isActive ? 0 : 0.35,

              duration: dur,
              ease,
            },
            0,
          );
        }

        if (collapsedTitle) {
          tl.to(
            collapsedTitle,
            {
              opacity: isMobile ? 0 : isActive ? 0 : 0.4,
              scale: isActive ? 0.95 : 1,
              duration: dur * 0.4,
              ease,
            },
            0,
          );
        }

        if (expandedContent) {
          tl.to(
            expandedContent,
            {
              opacity: isMobile ? 1 : isActive ? 1 : 0,

              y: isMobile ? 0 : isActive ? 0 : 12,

              duration: isActive ? dur : dur * 0.5,

              ease,
            },
            isActive ? dur * 0.2 : 0,
          );
        }

        if (line) {
          tl.to(
            line,
            {
              scaleX: isMobile ? 1 : isActive ? 1 : 0,

              opacity: isMobile ? 1 : isActive ? 1 : 0,

              transformOrigin: "left center",

              duration: dur,
              ease,
            },
            isActive ? dur * 0.25 : 0,
          );
        }
      });

      tlRef.current = tl;
    },
    [
      active,
      isMobile,
      count,
      expandRatio,
      duration,
      ease,
      vertical,
      tilt,
      parallax,
      grayscale,
      prefersReduced,
    ],
  );

  /* ---------------------------------------------------------------------- */
  /* MEASURE                                                                 */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const el = rootRef.current;

    if (!el) {
      return;
    }

    const measure = () => {
      const rect = el.getBoundingClientRect();

      const total = vertical ? rect.height : rect.width;

      const usable = Math.max(total - gap * (count - 1), 120);

      const size = Math.max(
        140,
        usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22,
      );

      mediaSizeRef.current = size;

      el.style.setProperty("--ag-media-size", `${size}px`);

      applyLayout(!firstRunRef.current);
    };

    measure();

    const observer = new ResizeObserver(measure);

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [applyLayout, gap, count, expandRatio, vertical]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);

    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  /* ---------------------------------------------------------------------- */
  /* INTERACTION                                                             */
  /* ---------------------------------------------------------------------- */

  const handleEnter = (i: number) => {
    if (trigger === "hover") {
      setActive(i);
    }
  };

  const handleClick = (i: number, e: MouseEvent<HTMLElement>) => {
    if (i !== active) {
      e.preventDefault();
      setActive(i);
    }
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();

      setActive((i + 1) % count);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();

      setActive((i - 1 + count) % count);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* SPOTLIGHT                                                               */
  /* ---------------------------------------------------------------------- */

  const handleSpotlightMove = (i: number, e: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      return;
    }

    const card = e.currentTarget;

    const spotlight = spotlightRefs.current[i];

    if (!spotlight) {
      return;
    }

    const rect = card.getBoundingClientRect();

    spotlight.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);

    spotlight.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);

    spotlight.style.opacity = "1";
  };

  const handleSpotlightLeave = (i: number) => {
    const spotlight = spotlightRefs.current[i];

    if (!spotlight) {
      return;
    }

    spotlight.style.opacity = "0";
  };

  /* ---------------------------------------------------------------------- */
  /* GLOW GRADIENTS                                                          */
  /* ---------------------------------------------------------------------- */

  const meshGradients = buildMeshGradients(glowColors);

  const borderBg = meshGradients.map((gradient) => `${gradient} border-box`);

  const fillBg = meshGradients.map((gradient) => `${gradient} padding-box`);

  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <div
      ref={rootRef}
      className={`flex ${
        vertical ? "flex-col" : "flex-row"
      } w-full max-w-full [perspective:1400px] max-[520px]:!flex-col max-[520px]:[perspective:none] ${className}`}
      style={{
        gap: isMobile ? "16px" : `${gap}px`,

        height: isMobile
          ? "auto"
          : vertical
            ? `${Math.round(height * 1.6)}px`
            : `${height}px`,
      }}
      role="list"
      aria-label="Image accordion gallery"
    >
      {items.map((item, i) => {
        const isActive = i === active;

        const glow = glowStates[i] ?? {
          angle: 45,
          proximity: 0,
          visible: false,
        };

        const colorSensitivity = Math.min(glowEdgeSensitivity + 20, 95);

        const borderOpacity = glow.visible
          ? Math.max(
              0,
              (glow.proximity * 100 - colorSensitivity) /
                (100 - colorSensitivity),
            )
          : 0;

        const glowOpacity = glow.visible
          ? Math.max(
              0,
              (glow.proximity * 100 - glowEdgeSensitivity) /
                (100 - glowEdgeSensitivity),
            )
          : 0;

        const angleDeg = `${glow.angle.toFixed(3)}deg`;

        const itemColor = item.color;
        const isCssColor =
          itemColor != null &&
          (/^#[0-9a-fA-F]{3,8}$/.test(itemColor) ||
            /^(rgb|hsl|rgba|hsla)\(/.test(itemColor));

        return (
          <div
            key={i}
            ref={(el: HTMLDivElement | null) => {
              panelRefs.current[i] = el;
            }}
            className={`
              group
              relative
              block
              min-w-0
              min-h-0
              flex-[1_1_0]
              cursor-pointer
              overflow-visible
              no-underline
              outline-none
              [isolation:isolate]
              [transform-style:preserve-3d]
              [transform-origin:center]
              max-[520px]:!flex-none
              max-[520px]:!min-h-0
              max-[520px]:!transform-none
              ${itemColor && !isCssColor ? itemColor : ""}
            `}
            style={
              {
                borderRadius: `${radius}px`,

                "--ag-accent": accentColor,

                backgroundColor: isCssColor ? itemColor : "#0a0713",

                willChange: "flex-grow, transform",

                /* DEFAULT BORDER */
                border: "1px solid rgba(255,255,255,0.20)",

                transition: "border-color 0.3s ease",

                /* keep shadow on card */
                boxShadow: "0 10px 30px -18px rgba(0,0,0,0.8)",
              } as CSSProperties
            }
            onClick={(e) => handleClick(i, e)}
            onMouseEnter={(e) => {
              handleEnter(i);
              handleSpotlightMove(i, e);
              setHoveredCard(i);
            }}
            onMouseMove={(e) => {
              handleSpotlightMove(i, e);
            }}
            onMouseLeave={() => {
              handleSpotlightLeave(i);
              setHoveredCard(null);
            }}
            onPointerMove={(e) => handleGlowMove(i, e)}
            onPointerLeave={() => handleGlowLeave(i)}
            onFocus={() => setActive(i)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? "true" : undefined}
            aria-label={item.title}
          >
            {/* ======================================================== */}
            {/* BORDER GLOW                                               */}
            {/* ======================================================== */}

            {glowEnabled && (
              <>
                {/* GRADIENT BORDER */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    rounded-[inherit]
                  "
                  style={
                    {
                      border: "1px solid transparent",

                      background: [
                        `linear-gradient(${glowBackgroundColor} 0 100%) padding-box`,
                        "linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box",
                        ...borderBg,
                      ].join(", "),

                      opacity: borderOpacity,

                      maskImage: `conic-gradient(
                        from ${angleDeg} at center,
                        black ${glowConeSpread}%,
                        transparent ${glowConeSpread + 15}%,
                        transparent ${100 - glowConeSpread - 15}%,
                        black ${100 - glowConeSpread}%
                      )`,

                      WebkitMaskImage: `conic-gradient(
                        from ${angleDeg} at center,
                        black ${glowConeSpread}%,
                        transparent ${glowConeSpread + 15}%,
                        transparent ${100 - glowConeSpread - 15}%,
                        black ${100 - glowConeSpread}%
                      )`,

                      transition: glow.visible
                        ? "opacity 0.2s ease-out"
                        : "opacity 0.5s ease-in-out",

                      zIndex: 2,

                      pointerEvents: "none",
                    } as CSSProperties
                  }
                />

                {/* EDGE FILL */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    rounded-[inherit]
                  "
                  style={
                    {
                      border: "1px solid transparent",

                      background: fillBg.join(", "),

                      maskImage: [
                        "linear-gradient(to bottom, black, black)",
                        "radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)",
                        "radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)",
                        "radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)",
                        "radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)",
                        "radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)",
                        `conic-gradient(
                          from ${angleDeg} at center,
                          transparent 5%,
                          black 15%,
                          black 85%,
                          transparent 95%
                        )`,
                      ].join(", "),

                      WebkitMaskImage: [
                        "linear-gradient(to bottom, black, black)",
                        "radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)",
                        "radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)",
                        "radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)",
                        "radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)",
                        "radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)",
                        `conic-gradient(
                            from ${angleDeg} at center,
                            transparent 5%,
                            black 15%,
                            black 85%,
                            transparent 95%
                          )`,
                      ].join(", "),

                      maskComposite: "subtract, add, add, add, add, add",

                      WebkitMaskComposite:
                        "source-out, source-over, source-over, source-over, source-over, source-over",

                      opacity: borderOpacity * glowFillOpacity,

                      mixBlendMode: "soft-light",

                      transition: glow.visible
                        ? "opacity 0.2s ease-out"
                        : "opacity 0.5s ease-in-out",

                      zIndex: 2,

                      pointerEvents: "none",
                    } as CSSProperties
                  }
                />

                {/* OUTER GLOW */}

                <span
                  className="
                    pointer-events-none
                    absolute
                    rounded-[inherit]
                  "
                  style={
                    {
                      inset: `${-glowRadius}px`,

                      maskImage: `conic-gradient(
                        from ${angleDeg} at center,
                        black 2.5%,
                        transparent 10%,
                        transparent 90%,
                        black 97.5%
                      )`,

                      WebkitMaskImage: `conic-gradient(
                        from ${angleDeg} at center,
                        black 2.5%,
                        transparent 10%,
                        transparent 90%,
                        black 97.5%
                      )`,

                      opacity: glowOpacity,

                      mixBlendMode: "plus-lighter",

                      transition: glow.visible
                        ? "opacity 0.2s ease-out"
                        : "opacity 0.6s ease-in-out",

                      zIndex: 1,

                      pointerEvents: "none",
                    } as CSSProperties
                  }
                >
                  <span
                    className="
                      absolute
                      rounded-[inherit]
                    "
                    style={{
                      inset: `${glowRadius}px`,

                      boxShadow: buildBoxShadow(glowColor, glowIntensity),
                    }}
                  />
                </span>
              </>
            )}

            {/* ======================================================== */}
            {/* IMAGE                                                      */}
            {/* ======================================================== */}

            <span
              className="
                absolute
                inset-0
                overflow-hidden
                [border-radius:inherit]
              "
              style={{
                zIndex: 0,
              }}
            >
              {item.image && (
                <span
                  ref={(el: HTMLElement | null) => {
                    mediaRefs.current[i] = el;
                  }}
                  className="
                    absolute
                    top-1/2
                    left-1/2
                    [filter:grayscale(var(--ag-gray,1))]
                  "
                  style={{
                    width: vertical ? "100%" : "var(--ag-media-size, 320px)",

                    height: vertical ? "var(--ag-media-size, 320px)" : "100%",

                    willChange: "transform, filter",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.alt || item.title || ""}
                    draggable={false}
                    className="
                      block
                      h-full
                      w-full
                      select-none
                      object-cover
                      [-webkit-user-drag:none]
                    "
                  />
                </span>
              )}

              {/* OVERLAY */}

              <span
                className="
                  pointer-events-none
                  absolute
                  inset-0
                "
                style={{
                  background: overlayBg,
                }}
                aria-hidden="true"
              />
            </span>

            {/* ======================================================== */}
            {/* SPOTLIGHT                                                 */}
            {/* ======================================================== */}

            <div
              ref={(el) => {
                spotlightRefs.current[i] = el;
              }}
              className="
                pointer-events-none
                absolute
                inset-0
                z-[3]
                rounded-[inherit]
                opacity-0
                transition-opacity
                duration-500
                ease-out
              "
              style={{
                background:
                  "radial-gradient(circle 300px at var(--spotlight-x) var(--spotlight-y), rgba(255,255,255,0.2), transparent 100%)",
              }}
              aria-hidden="true"
            />

            {/* ======================================================== */}
            {/* COLLAPSED TITLE                                           */}
            {/* ======================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                z-[4]
                overflow-hidden
              "
              aria-hidden="true"
            >
              <div className="absolute inset-0 flex items-end justify-center">
                <div className="mb-8 flex h-auto w-auto items-center justify-center">
                  <div
                    ref={(el: HTMLDivElement | null) => {
                      collapsedTitleRefs.current[i] = el;
                    }}
                    className="
                      whitespace-nowrap
                      text-[clamp(1.5rem,3vw,3rem)]
                      font-aeonik
                      font-medium
                      tracking-[0.02em]
                    "
                    style={{
                      color: textColor,

                      writingMode: "vertical-rl",

                      transform: "rotate(180deg)",
                    }}
                  >
                    {item.title}
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* EXPANDED CONTENT                                          */}
            {/* ======================================================== */}

            {showContent && (
              <div
                ref={(el: HTMLDivElement | null) => {
                  expandedContentRefs.current[i] = el;
                }}
                className="
                  pointer-events-none
                  relative
                  z-[5]
                  flex
                  items-start
                  justify-start
                  px-10
                  pt-10
                  pb-10
                  opacity-0
                  max-[520px]:px-5
                  max-[520px]:pt-6
                  max-[520px]:pb-6
                  max-[520px]:opacity-100
                "
                style={{
                  color: textColor,
                }}
                aria-hidden="true"
              >
                <div className="w-full max-w-[560px]">
                  {/* TITLE */}

                  <span
                    className="
                      block
                      text-2xl
                      font-aeonik
                      font-medium
                      tracking-[0.02em]
                      md:text-3xl
                      lg:text-5xl
                      [text-shadow:0_2px_14px_rgba(0,0,0,0.55)]
                    "
                  >
                    {item.title}
                  </span>

                  {/* LINE */}

                  <span
                    ref={(el: HTMLElement | null) => {
                      lineRefs.current[i] = el;
                    }}
                    className="
                      lg:mt-5
                      mt-2
                      block
                      h-[3px]
                      w-[165px]
                      origin-left
                      rounded-full
                      opacity-0
                    "
                    style={{
                      background: accentColor,

                      boxShadow: `0 0 12px color-mix(in srgb, ${accentColor} 60%, transparent)`,
                    }}
                  />

                  {/* DESCRIPTION */}

                  {item.description && (
                    <span
                      className="
                        mt-4
                        block
                        text-sm
                        leading-[1.6]
                        opacity-85
                        md:text-lg
                        lg:text-xl
                      "
                    >
                      {item.description}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AccordionGallery;
