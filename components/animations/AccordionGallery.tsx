import {
  useRef,
  useEffect,
  useState,
  useCallback,
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
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
}

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
}: AccordionGalleryProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLElement | null)[]>([]);
  const collapsedTitleRefs = useRef<(HTMLElement | null)[]>([]);
  const expandedContentRefs = useRef<(HTMLElement | null)[]>([]);
  const lineRefs = useRef<(HTMLElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);

  const vertical = orientation === "vertical";
  const count = items.length;

  const [active, setActive] = useState(
    Math.min(Math.max(defaultIndex, 0), count - 1),
  );

  const [isMobile, setIsMobile] = useState(false);

  const prefersReduced =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

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

  const overlayBg = `linear-gradient(
    180deg,
    transparent 35%,
    color-mix(in srgb, ${overlayColor} 85%, transparent) 100%
  ),
  color-mix(
    in srgb,
    ${overlayColor} calc(var(--ag-dim, 0.35) * 100%),
    transparent
  )`;

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();

      const dur = animate && !prefersReduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;

        const isActive = isMobile ? true : i === active;
        const media = mediaRefs.current[i];
        const collapsedTitle = collapsedTitleRefs.current[i];
        const expandedContent = expandedContentRefs.current[i];
        const line = lineRefs.current[i];

        const rot = isMobile ? 0 : isActive ? 0 : i < active ? tilt : -tilt;

        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

        // PANEL
        tl.to(
          panel,
          {
            flexGrow: isMobile ? 0 : isActive ? grow : 1,
            opacity: isMobile ? 1 : isActive ? 1 : 0.4,
            ...rotProp,
            duration: dur,
            ease,
          },
          0,
        );
        // IMAGE
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

        // COLLAPSED TITLE
        if (collapsedTitle) {
          tl.to(
            collapsedTitle,
            {
              opacity: isMobile ? 0 : isActive ? 0 : 1,
              scale: isActive ? 0.95 : 1,
              duration: dur,
              ease,
            },
            0,
          );
        }

        // EXPANDED CONTENT
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

        // HORIZONTAL LINE
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

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

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

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    return () => ro.disconnect();
  }, [applyLayout, gap, count, expandRatio, vertical]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    [],
  );

  const handleEnter = (i: number) => {
    if (trigger === "hover") {
      setActive(i);
    }
  };

  const handleClick = (i: number, e: MouseEvent) => {
    if (i !== active) {
      e.preventDefault();
      setActive(i);
    }
  };

  const handleKeyDown = (i: number, e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i + 1) % count);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i - 1 + count) % count);
    }
  };

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
        const Tag = (item.link ? "a" : "div") as "a";

        return (
          <Tag
            key={i}
            ref={(el: HTMLElement | null) => {
              panelRefs.current[i] = el;
            }}
            className="group relative block min-w-0 min-h-0 flex-[1_1_0] border border-neutral-100 cursor-pointer overflow-hidden no-underline outline-none [transform-style:preserve-3d] [transform-origin:center] [box-shadow:0_10px_30px_-18px_rgba(0,0,0,0.8)] focus-visible:[box-shadow:0_0_0_2px_var(--ag-accent),0_10px_30px_-18px_rgba(0,0,0,0.8)] max-[520px]:!flex-none max-[520px]:!min-h-0 max-[520px]:!transform-none"
            style={
              {
                borderRadius: `${radius}px`,
                "--ag-accent": accentColor,
                backgroundColor: item.color || "#0a0713",
                willChange: "flex-grow, transform",
              } as CSSProperties
            }
            href={item.link || undefined}
            onClick={(e) => handleClick(i, e)}
            onMouseEnter={() => handleEnter(i)}
            onFocus={() => setActive(i)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? "true" : undefined}
            aria-label={item.title}
          >
            <span className="absolute inset-0 overflow-hidden [border-radius:inherit]">
              {/* IMAGE */}
              {item.image && (
                <span
                  ref={(el: HTMLElement | null) => {
                    mediaRefs.current[i] = el;
                  }}
                  className="absolute top-1/2 left-1/2 [filter:grayscale(var(--ag-gray,1))]"
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
                    className="block h-full w-full select-none object-cover [-webkit-user-drag:none]"
                  />
                </span>
              )}

              {/* OVERLAY */}
              <span
                className="pointer-events-none absolute inset-0"
                style={{
                  background: overlayBg,
                }}
                aria-hidden="true"
              />
            </span>

            {/* COLLAPSED TITLE */}
            <div
              className="pointer-events-none absolute inset-0 z-[3] overflow-hidden"
              aria-hidden="true"
            >
              <div className="absolute inset-0 flex items-end justify-center">
                <div className="mb-8 flex h-auto w-auto items-center justify-center">
                  <div
                    ref={(el: HTMLDivElement | null) => {
                      collapsedTitleRefs.current[i] = el;
                    }}
                    className="whitespace-nowrap text-[clamp(1.5rem,3vw,3rem)] font-semibold uppercase tracking-[0.02em]"
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

            {/* EXPANDED CONTENT */}
            {showContent && (
              <div
                ref={(el: HTMLDivElement | null) => {
                  expandedContentRefs.current[i] = el;
                }}
                className="pointer-events-none relative z-[4] flex items-start justify-start px-10 pt-10 pb-10 opacity-0 max-[520px]:px-5 max-[520px]:pt-6 max-[520px]:pb-6 max-[520px]:opacity-100"
                style={{ color: textColor }}
                aria-hidden="true"
              >
                <div className="w-full max-w-[560px]">
                  {/* TITLE */}
                  <span className="block text-2xl md:text-3xl lg:text-5xl font-semibold uppercase tracking-[0.02em] [text-shadow:0_2px_14px_rgba(0,0,0,0.55)]">
                    {item.title}
                  </span>

                  {/* LINE */}
                  <span
                    ref={(el: HTMLElement | null) => {
                      lineRefs.current[i] = el;
                    }}
                    className="mt-5 block h-[3px] w-[165px] origin-left rounded-full opacity-0"
                    style={{
                      background: accentColor,
                      boxShadow: `0 0 12px color-mix(in srgb, ${accentColor} 60%, transparent)`,
                    }}
                  />

                  {/* DESCRIPTION */}
                  {item.description && (
                    <span className="mt-4 block text-sm md:text-lg lg:text-xl leading-[1.6] opacity-85">
                      {item.description}
                    </span>
                  )}
                </div>
              </div>
            )}
          </Tag>
        );
      })}
    </div>
  );
};

export default AccordionGallery;
