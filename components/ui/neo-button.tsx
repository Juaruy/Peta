"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Circle, MessagesSquare } from "lucide-react";
import { cn } from "@/lib/utils";

/* ================================================================
   SIZE TYPES
   ================================================================ */

type ButtonSize = "sm" | "md" | "lg" | "xl";

type ResponsiveSize = {
  base: ButtonSize;
  sm?: ButtonSize;
  md?: ButtonSize;
  lg?: ButtonSize;
  xl?: ButtonSize;
};

type NeoButtonSize = ButtonSize | ResponsiveSize;

/* ================================================================
   PROPS
   ================================================================ */

type NeoButtonProps = {
  children: React.ReactNode;

  /* ================================================================
     VARIANT
     ================================================================ */
  variant?: "global" | "global-action" | "menu";

  /* ================================================================
     SIZE
     =================================================================

     Fixed:
     size="lg"

     Responsive:
     size={{
       base: "sm",
       lg: "lg",
     }}

     ================================================================ */
  size?: NeoButtonSize;

  /* ================================================================
     PRESET COLORS
     ================================================================ */
  color?: "primary" | "secondary";

  /* ================================================================
     CUSTOM COLORS
     ================================================================ */
  bgColor?: string;
  textColor?: string;
  iconBgColor?: string;

  /* ================================================================
     ICON
     ================================================================ */
  icon?: boolean;
  customIcon?: React.ReactNode;

  /* ================================================================
     ICON POSITION
     ================================================================ */
  iconPosition?: "left" | "right" | "only";

  /* ================================================================
     GLOBAL ICON HOVER
     ================================================================ */
  iconHover?: "side" | "up" | "none";

  /* ================================================================
     CUSTOM CLASS
     ================================================================ */
  className?: string;
  iconClassName?: string;

  /* ================================================================
     EVENT
     ================================================================ */
  onClick?: () => void;
};

/* ================================================================
   SIZES
   =================================================================

   text:
   → font-size

   font:
   → font-weight

   icon:
   → ukuran container icon ketika button memiliki text

   iconSize:
   → ukuran glyph/icon

   iconOnlyHeight / iconOnlyWidth:
   → ukuran button ketika iconPosition="only"

   actionHeight:
   → ukuran global-action ketika memiliki text

   actionWidth:
   → ukuran khusus global-action

   ================================================================ */

const sizes = {
  sm: {
    text: "text-[14px]",
    font: "font-medium",

    textPadding: "pl-3 pr-2",

    icon: "h-[30px] w-[30px]",
    iconSize: "h-[14px] w-[14px]",

    iconPx: 14,

    outer: "m-[3px]",

    iconOnlyHeight: "h-[36px]",
    iconOnlyWidth: "w-[36px]",

    actionHeight: "h-[36px]",
    actionWidth: "w-[36px]",

    actionPadding: "px-3",
    actionIconPad: "px-[32px]",

    dotSize: 5,
    dotGap: 6,
  },

  md: {
    text: "text-[14px]",
    font: "font-medium",

    textPadding: "pl-3.5 pr-2.5",

    icon: "h-[34px] w-[34px]",
    iconSize: "h-[15px] w-[15px]",

    iconPx: 15,

    outer: "m-[3px]",

    iconOnlyHeight: "h-[40px]",
    iconOnlyWidth: "w-[40px]",

    actionHeight: "h-[40px]",
    actionWidth: "w-[40px]",

    actionPadding: "px-3.5",
    actionIconPad: "px-[36px]",

    dotSize: 5,
    dotGap: 7,
  },

  lg: {
    text: "text-[16px]",
    font: "font-medium",

    textPadding: "pl-4 pr-2.5",

    icon: "h-[38px] w-[38px]",
    iconSize: "h-[16px] w-[16px]",

    iconPx: 16,

    outer: "m-[3px]",

    iconOnlyHeight: "h-[44px]",
    iconOnlyWidth: "w-[44px]",

    actionHeight: "h-[44px]",
    actionWidth: "w-[44px]",

    actionPadding: "px-4",
    actionIconPad: "px-7",

    dotSize: 6,
    dotGap: 8,
  },

  xl: {
    text: "text-[16px]",
    font: "font-medium",

    textPadding: "pl-4 pr-2.5",

    icon: "h-[42px] w-[42px]",
    iconSize: "h-[17px] w-[17px]",

    iconPx: 17,

    outer: "m-[3px]",

    iconOnlyHeight: "h-[48px]",
    iconOnlyWidth: "w-[48px]",

    actionHeight: "h-[48px]",
    actionWidth: "w-[48px]",

    actionPadding: "px-5",
    actionIconPad: "px-8",

    dotSize: 6,
    dotGap: 8,
  },
};

/* ================================================================
   RESPONSIVE SIZE HOOK
   =================================================================

   Tailwind default breakpoints:

   sm → 640px
   md → 768px
   lg → 1024px
   xl → 1280px

   Contoh:

   size={{
     base: "sm",
     lg: "lg",
   }}

   Mobile  → sm
   ≥1024px → lg

   ================================================================ */

function useResponsiveSize(size: NeoButtonSize): ButtonSize {
  const getBaseSize = (): ButtonSize => {
    if (typeof size === "string") {
      return size;
    }

    return size.base;
  };

  const [currentSize, setCurrentSize] = useState<ButtonSize>(getBaseSize);

  useEffect(() => {
    if (typeof size === "string") {
      setCurrentSize(size);
      return;
    }

    const updateSize = () => {
      const width = window.innerWidth;

      let resolvedSize = size.base;

      if (width >= 640 && size.sm) {
        resolvedSize = size.sm;
      }

      if (width >= 768 && size.md) {
        resolvedSize = size.md;
      }

      if (width >= 1024 && size.lg) {
        resolvedSize = size.lg;
      }

      if (width >= 1280 && size.xl) {
        resolvedSize = size.xl;
      }

      setCurrentSize(resolvedSize);
    };

    updateSize();

    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, [size]);

  return currentSize;
}

/* ================================================================
   MENU ITEMS
   ================================================================ */

const menuItems = [
  {
    label: "Work",
    href: "#work",
  },
  {
    label: "Studio",
    href: "#studio",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

/* ================================================================
   COLOR VARIANTS
   ================================================================ */

const colorVariants = {
  primary: {
    bg: "bg-neutral-50",
    text: "text-black",
    iconBg: "bg-neutral-100",
    washBg: "bg-neutral-900",
    washText: "text-white",
  },

  secondary: {
    bg: "bg-neutral-900",
    text: "text-white",
    iconBg: "bg-neutral-800",
    washBg: "bg-neutral-200",
    washText: "text-black",
  },
};

/* ================================================================
   MENU DOT ICON
   ================================================================ */

function MenuDotsIcon({
  size,
  isOpen,
}: {
  size: (typeof sizes)[keyof typeof sizes];
  isOpen: boolean;
}) {
  const dotSize = size.dotSize;
  const gap = size.dotGap;
  const offset = dotSize / 2 + gap / 5;

  return (
    <motion.span
      className="
        relative
        flex
        h-7
        w-7
        shrink-0
        items-center
        justify-center
      "
      initial={false}
      animate={isOpen ? "open" : "closed"}
    >
      <motion.span
        className="
          absolute
          flex
          items-center
          justify-center
        "
        variants={{
          closed: {
            x: -offset,
            y: 0,
          },
          open: {
            x: 0,
            y: -offset,
          },
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 20,
        }}
      >
        <Circle
          size={dotSize}
          strokeWidth={3}
          fill="currentColor"
          className="text-current"
        />
      </motion.span>

      <motion.span
        className="
          absolute
          flex
          items-center
          justify-center
        "
        variants={{
          closed: {
            x: offset,
            y: 0,
          },
          open: {
            x: 0,
            y: offset,
          },
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 20,
        }}
      >
        <Circle
          size={dotSize}
          strokeWidth={3}
          fill="currentColor"
          className="text-current"
        />
      </motion.span>
    </motion.span>
  );
}

/* ================================================================
   GLOBAL ICON
   ================================================================ */

function GlobalIcon({
  icon,
  direction,
  isHovered,
}: {
  icon: React.ReactNode;
  direction: "side" | "up" | "none";
  isHovered: boolean;
}) {
  if (direction === "none") {
    return <span className="flex items-center justify-center">{icon}</span>;
  }

  const isVertical = direction === "up";

  return (
    <span
      className="
        relative
        flex
        h-full
        w-full
        items-center
        justify-center
        overflow-hidden
      "
    >
      <AnimatePresence initial={false} mode="popLayout">
        {!isHovered ? (
          <motion.span
            key="rest"
            initial={{
              x: isVertical ? 0 : "100%",
              y: isVertical ? "100%" : 0,
            }}
            animate={{
              x: 0,
              y: 0,
            }}
            exit={{
              x: isVertical ? 0 : "-100%",
              y: isVertical ? "-100%" : 0,
            }}
            transition={{
              duration: 0.4,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
            "
          >
            {icon}
          </motion.span>
        ) : (
          <motion.span
            key="hover"
            initial={{
              x: isVertical ? 0 : "100%",
              y: isVertical ? "100%" : 0,
            }}
            animate={{
              x: 0,
              y: 0,
            }}
            exit={{
              x: isVertical ? 0 : "-100%",
              y: isVertical ? "-100%" : 0,
            }}
            transition={{
              duration: 0.4,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
            "
          >
            {icon}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/* ================================================================
   GLOBAL ACTION ICON ONLY
   ================================================================ */

function GlobalActionIconOnly({
  icon,
  size,
  color,
  isHovered,
}: {
  icon: React.ReactNode;
  size: (typeof sizes)[keyof typeof sizes];
  color: "primary" | "secondary";
  isHovered: boolean;
}) {
  return (
    <span
      className={cn(
        `
          relative
          flex
          shrink-0
          items-center
          justify-center
          overflow-hidden
        `,
        size.iconOnlyHeight,
        size.iconOnlyWidth,
      )}
    >
      {/* ==========================================================
          ICON UTAMA
          ========================================================== */}

      <motion.span
        initial={false}
        animate={{
          x: isHovered ? "-150%" : "0%",
          opacity: isHovered ? 0 : 1,
        }}
        transition={{
          duration: 0.65,
          ease: [0.76, 0, 0.24, 1],
        }}
        className={cn(
          `
            absolute
            inset-0
            flex
            items-center
            justify-center
            will-change-transform
          `,
          colorVariants[color].text,
        )}
      >
        {icon}
      </motion.span>

      {/* ==========================================================
          ICON HOVER
          ========================================================== */}

      <motion.span
        initial={false}
        animate={{
          x: isHovered ? "0%" : "150%",
          opacity: isHovered ? 1 : 0,
        }}
        transition={{
          duration: 0.65,
          ease: [0.76, 0, 0.24, 1],
        }}
        className={cn(
          `
            absolute
            inset-0
            flex
            items-center
            justify-center
            will-change-transform
          `,
          colorVariants[color].text,
        )}
      >
        {icon}
      </motion.span>
    </span>
  );
}

/* ================================================================
   GLOBAL ACTION CONTENT
   ================================================================ */

function GlobalActionContent({
  icon,
  children,
  iconPosition,
  size,
  color,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  iconPosition: "left" | "right";
  size: (typeof sizes)[keyof typeof sizes];
  color: "primary" | "secondary";
}) {
  const isRight = iconPosition === "right";

  const iconMainPos = isRight
    ? "right-4 group-hover:right-[-25%]"
    : "left-4 group-hover:left-[-25%]";

  const iconHoverPos = isRight
    ? "left-[-25%] group-hover:left-4"
    : "right-[-25%] group-hover:right-4";

  const textShift = isRight
    ? "-translate-x-2 group-hover:translate-x-2"
    : "translate-x-2 group-hover:-translate-x-2";

  return (
    <span
      className={cn(
        `
          relative
          flex
          shrink-0
          items-center
          justify-center
          overflow-hidden
        `,
        size.actionHeight,
      )}
    >
      {/* ==========================================================
          ICON UTAMA
          ========================================================== */}

      <span
        className={cn(
          `
            absolute
            z-20
            flex
            shrink-0
            items-center
            justify-center
            transition-[left,right,transform,opacity]
            duration-[650ms]
            ease-[cubic-bezier(0.76,0,0.24,1)]
            will-change-[left,right,transform]
          `,
          size.iconSize,
          iconMainPos,
          colorVariants[color].text,
        )}
      >
        {icon}
      </span>

      {/* ==========================================================
          ICON HOVER
          ========================================================== */}

      <span
        className={cn(
          `
            absolute
            z-20
            flex
            shrink-0
            items-center
            justify-center
            transition-[left,right,transform,opacity]
            duration-[650ms]
            ease-[cubic-bezier(0.76,0,0.24,1)]
            will-change-[left,right,transform]
          `,
          size.iconSize,
          iconHoverPos,
          colorVariants[color].text,
        )}
      >
        {icon}
      </span>

      {/* ==========================================================
          TEXT
          ========================================================== */}

      <span
        className={cn(
          `
            relative
            z-10
            block
            w-max
            shrink-0
            whitespace-nowrap
            leading-none
            tracking-[-0.03em]
            transition-transform
            duration-[650ms]
            ease-[cubic-bezier(0.76,0,0.24,1)]
            will-change-transform
          `,
          size.text,
          size.font,
          textShift,
          size.actionIconPad,
          colorVariants[color].text,
        )}
      >
        {children}
      </span>
    </span>
  );
}

/* ================================================================
   NEO BUTTON
   ================================================================ */

export default function NeoButton({
  children,
  variant = "global",
  size = "lg",
  color = "secondary",
  bgColor,
  textColor,
  iconBgColor,
  icon = true,
  customIcon,
  iconPosition = "right",
  iconHover = "side",
  className,
  iconClassName,
  onClick,
}: NeoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isMenu = variant === "menu";
  const isGlobalAction = variant === "global-action";

  /* ================================================================
     RESPONSIVE SIZE
     ================================================================ */

  const resolvedSize = useResponsiveSize(size);
  const currentSize = sizes[resolvedSize];

  const buttonLabel = isMenu && isOpen ? "Close" : children;

  const currentColor = colorVariants[color];

  const isDotsVertical = isHovered !== isOpen;

  /* ================================================================
     LABEL DETECTION
     ================================================================ */

  const hasLabel =
    buttonLabel !== null &&
    buttonLabel !== undefined &&
    buttonLabel !== false &&
    (typeof buttonLabel !== "string" || buttonLabel.trim().length > 0);

  /* ================================================================
     ICON ONLY
     ================================================================ */

  const isIconOnly =
    iconPosition === "only" || (isGlobalAction && icon && !hasLabel);

  /* ================================================================
     CLICK
     ================================================================ */

  const handleClick = () => {
    if (isMenu) {
      setIsOpen((prev) => !prev);
    }

    onClick?.();
  };

  /* ================================================================
     DEFAULT GLOBAL ICON
     ================================================================ */

  const defaultGlobalIcon = (
    <MessagesSquare strokeWidth={2} className={currentSize.iconSize} />
  );

  /* ================================================================
     CUSTOM ICON
     ================================================================ */

  const finalIcon = customIcon ? (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center",
        isGlobalAction && currentSize.iconSize,
        isGlobalAction && iconClassName,
      )}
    >
      {customIcon}
    </span>
  ) : (
    defaultGlobalIcon
  );

  /* ================================================================
     STANDARD ICON ELEMENT
     ================================================================ */

  const iconElement =
    icon && !isGlobalAction ? (
      <div
        style={{
          backgroundColor: iconBgColor,
        }}
        className={cn(
          `
            flex
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-full
          `,
          currentSize.icon,
          currentSize.outer,
          currentColor.iconBg,
          iconClassName,
        )}
      >
        {isMenu ? (
          <MenuDotsIcon size={currentSize} isOpen={isDotsVertical} />
        ) : (
          <GlobalIcon
            icon={finalIcon}
            direction={iconHover}
            isHovered={isHovered}
          />
        )}
      </div>
    ) : null;

  /* ================================================================
     ICON ONLY ELEMENT
     ================================================================ */

  const iconOnlyElement =
    icon && !isGlobalAction && isIconOnly ? (
      <span
        className={cn(
          `
            flex
            shrink-0
            items-center
            justify-center
          `,
          currentSize.iconOnlyHeight,
          currentSize.iconOnlyWidth,
          iconClassName,
        )}
      >
        {isMenu ? (
          <MenuDotsIcon size={currentSize} isOpen={isDotsVertical} />
        ) : (
          <GlobalIcon
            icon={finalIcon}
            direction={iconHover}
            isHovered={isHovered}
          />
        )}
      </span>
    ) : null;

  /* ================================================================
     RETURN
     ================================================================ */

  return (
    <div
      className={cn(
        "relative w-fit",
        isGlobalAction && isIconOnly && currentSize.iconOnlyHeight,
        isGlobalAction && isIconOnly && currentSize.iconOnlyWidth,
      )}
    >
      <motion.button
        initial="rest"
        whileHover="hover"
        animate="rest"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        variants={{
          rest: {
            scale: 1,
            y: 0,
          },

          hover: {
            scale: 1.06,
            y: -2,
            transition: {
              type: "spring",
              stiffness: 420,
              damping: 12,
              mass: 0.6,
            },
          },
        }}
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
        className={cn(
          `
            group
            relative
            z-50
            inline-flex
            w-fit
            shrink-0
            items-center
            overflow-hidden
            rounded-full
            cursor-pointer
            font-inherit
            will-change-transform
          `,
          isGlobalAction && isIconOnly && currentSize.iconOnlyHeight,
          isGlobalAction && isIconOnly && currentSize.iconOnlyWidth,
          currentColor.bg,
          currentColor.text,
          className,
        )}
      >
        {/* ==========================================================
            GLOBAL ACTION
            ========================================================== */}

        {isGlobalAction ? (
          icon ? (
            isIconOnly ? (
              <GlobalActionIconOnly
                icon={finalIcon}
                size={currentSize}
                color={color}
                isHovered={isHovered}
              />
            ) : (
              <GlobalActionContent
                icon={finalIcon}
                iconPosition={iconPosition}
                size={currentSize}
                color={color}
              >
                {buttonLabel}
              </GlobalActionContent>
            )
          ) : (
            <span
              className={cn(
                `
                  relative
                  z-10
                  flex
                  items-center
                  justify-center
                  w-max
                  whitespace-nowrap
                  leading-none
                  tracking-[-0.03em]
                `,
                currentSize.text,
                currentSize.font,
                currentSize.actionHeight,
                currentSize.actionPadding,
                colorVariants[color].text,
              )}
            >
              {buttonLabel}
            </span>
          )
        ) : isIconOnly ? (
          /* ==========================================================
             STANDARD ICON ONLY
             ========================================================== */

          iconOnlyElement
        ) : (
          <>
            {/* ======================================================
                ICON LEFT
                ====================================================== */}

            {iconPosition === "left" && iconElement}

            {/* ======================================================
                LABEL
                ====================================================== */}

            <span className="relative inline-block overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={isMenu ? (isOpen ? "close" : "open") : "label"}
                  initial={{
                    y: "100%",
                  }}
                  animate={{
                    y: "0%",
                  }}
                  exit={{
                    y: "-100%",
                  }}
                  transition={{
                    duration: 0.45,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                  className={cn(
                    `
                      block
                      w-max
                      whitespace-nowrap
                      leading-none
                      tracking-[-0.03em]
                    `,
                    currentSize.text,
                    currentSize.font,
                    icon ? currentSize.textPadding : "px-6 py-4",
                  )}
                >
                  {buttonLabel}
                </motion.span>
              </AnimatePresence>
            </span>

            {/* ======================================================
                ICON RIGHT
                ====================================================== */}

            {iconPosition === "right" && iconElement}
          </>
        )}
      </motion.button>

      {/* ============================================================
          MENU DROPDOWN
          ============================================================ */}

      <AnimatePresence>
        {isMenu && isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              x: 120,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: 120,
            }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 18,
            }}
            className="
              absolute
              right-0
              top-[calc(100%+16px)]
              z-40
              w-[260px]
              rounded-[32px]
              bg-neutral-50
              p-6
              shadow-2xl
              sm:w-[320px]
              sm:p-8
            "
          >
            <div className="flex flex-col gap-2">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{
                    opacity: 0,
                    x: 30,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: index * 0.06,
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                  onClick={() => {
                    const target = document.querySelector(item.href);

                    if (target) {
                      target.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }

                    setIsOpen(false);
                  }}
                  className="
                    w-full
                    rounded-xl
                    px-4
                    py-3
                    text-left
                    text-[24px]
                    font-medium
                    leading-none
                    tracking-[-0.05em]
                    text-black
                    transition-all
                    cursor-pointer
                    duration-200
                    hover:bg-white/50
                    hover:opacity-60
                    sm:text-[52px]
                  "
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
