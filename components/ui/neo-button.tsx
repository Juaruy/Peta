"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { MessagesSquare, Circle } from "lucide-react";

import { cn } from "@/lib/utils";

type NeoButtonProps = {
  children: React.ReactNode;

  /* ================================================================
     VARIANT
     ================================================================= */
  variant?: "global" | "menu";

  /* ================================================================
     SIZE
     ================================================================= */
  size?: "sm" | "md" | "lg" | "xl";

  /* ================================================================
     PRESET COLORS
     ================================================================= */
  color?: "primary" | "secondary";

  /* ================================================================
     CUSTOM COLORS
     ================================================================= */
  bgColor?: string;
  textColor?: string;
  iconBgColor?: string;

  /* ================================================================
     ICON
     ================================================================= */
  icon?: boolean;
  customIcon?: React.ReactNode;

  /* ================================================================
     GLOBAL ICON HOVER
     side = icon slides horizontally
     up   = icon slides vertically
     none = no icon hover animation

     Only applies to variant="global".
     ================================================================= */
  iconHover?: "side" | "up" | "none";

  /* ================================================================
     CUSTOM CLASS
     ================================================================= */
  className?: string;
  iconClassName?: string;

  /* ================================================================
     EVENT
     ================================================================= */
  onClick?: () => void;
};

/* ================================================================
   SIZES
   ================================================================= */

const sizes = {
  sm: {
    text: "text-[14px]",
    font: "font-medium",
    textPadding: "pl-4 pr-2.5",
    icon: "h-[38px] w-[38px]",
    iconSize: "h-[16px] w-[16px]",
    outer: "m-[3px]",
    dotSize: 6,
    dotGap: 9,
  },

  md: {
    text: "text-[16px]",
    font: "font-semibold",
    textPadding: "pl-5 pr-3",
    icon: "h-[46px] w-[46px]",
    iconSize: "h-[18px] w-[18px]",
    outer: "m-[4px]",
    dotSize: 7,
    dotGap: 11,
  },

  lg: {
    text: "text-[18px]",
    font: "font-semibold",
    textPadding: "pl-6 pr-4",
    icon: "h-[52px] w-[52px]",
    iconSize: "h-[20px] w-[20px]",
    outer: "m-[4px]",
    dotSize: 8,
    dotGap: 12,
  },

  xl: {
    text: "text-[22px]",
    font: "font-semibold",
    textPadding: "pl-7 pr-5",
    icon: "h-[60px] w-[60px]",
    iconSize: "h-[24px] w-[24px]",
    outer: "m-[5px]",
    dotSize: 9,
    dotGap: 13,
  },
};

/* ================================================================
   MENU ITEMS

   href harus sama dengan ID section.

   Contoh:
   <section id="work">
   ================================================================= */

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
   ================================================================= */

const colorVariants = {
  primary: {
    bg: "bg-neutral-200",
    text: "text-black",
    iconBg: "bg-neutral-100",
  },

  secondary: {
    bg: "bg-neutral-900",
    text: "text-white",
    iconBg: "bg-neutral-800",
  },
};

/* ================================================================
   MENU DOT ICON
   ================================================================= */

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
      className="relative flex h-7 w-7 shrink-0 items-center justify-center"
      initial={false}
      animate={isOpen ? "open" : "closed"}
    >
      {/* DOT 1 */}
      <motion.span
        className="absolute flex items-center justify-center"
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

      {/* DOT 2 */}
      <motion.span
        className="absolute flex items-center justify-center"
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

   Icon keluar dari satu sisi lalu icon baru masuk
   dari sisi berlawanan.

   side:
   - keluar kiri
   - masuk dari kanan

   up:
   - keluar atas
   - masuk dari bawah

   none:
   - static
   ================================================================= */

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
    <span className="relative flex h-full w-full items-center justify-center overflow-hidden">
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
            className="absolute inset-0 flex items-center justify-center"
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
            className="absolute inset-0 flex items-center justify-center"
          >
            {icon}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/* ================================================================
   COMPONENT
   ================================================================= */

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
  iconHover = "side",
  className,
  iconClassName,
  onClick,
}: NeoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isMenu = variant === "menu";

  const buttonLabel = isMenu && isOpen ? "Close" : children;

  const currentSize = sizes[size];
  const currentColor = colorVariants[color];

  const isDotsVertical = isHovered !== isOpen;

  /* ================================================================
     BUTTON CLICK
     ================================================================= */

  const handleClick = () => {
    if (isMenu) {
      setIsOpen((prev) => !prev);
    }

    onClick?.();
  };

  /* ================================================================
     DEFAULT GLOBAL ICON
     ================================================================= */

  const defaultGlobalIcon = (
    <MessagesSquare strokeWidth={2} className={currentSize.iconSize} />
  );

  return (
    <div className="relative w-fit">
      {/* ============================================================== 
          BUTTON
          ============================================================== */}

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
          currentColor.bg,
          currentColor.text,
          className,
        )}
      >
        {/* ============================================================
            LABEL
            ============================================================= */}

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
                  !text-[16px]
                `,
                currentSize.font,
                icon ? currentSize.textPadding : "px-6 py-4",
              )}
            >
              {buttonLabel}
            </motion.span>
          </AnimatePresence>
        </span>

        {/* ============================================================
            ICON
            ============================================================= */}

        {icon && (
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
            {/* ========================================================
                MENU ICON
                ======================================================== */}

            {isMenu ? (
              <MenuDotsIcon size={currentSize} isOpen={isDotsVertical} />
            ) : (
              /* ======================================================
                 GLOBAL ICON
                 ====================================================== */

              <GlobalIcon
                icon={customIcon ? customIcon : defaultGlobalIcon}
                direction={iconHover}
                isHovered={isHovered}
              />
            )}
          </div>
        )}
      </motion.button>

      {/* ============================================================== 
          MENU DROPDOWN
          ============================================================== */}

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
              bg-neutral-200
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
                    font-semibold
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
