"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NeoButtonProps = {
  children: React.ReactNode;

  /* VARIANT */
  variant?: "global" | "menu";

  /* SIZE */
  size?: "sm" | "md" | "lg" | "xl";

  /* PRESET COLORS */
  color?: "primary" | "secondary";

  /* CUSTOM COLORS */
  bgColor?: string;
  textColor?: string;
  iconBgColor?: string;

  /* ICON */
  icon?: boolean;
  customIcon?: React.ReactNode;

  className?: string;
  iconClassName?: string;

  onClick?: () => void;
};

const sizes = {
  sm: {
    text: "text-[14px]",
    font: "font-medium",
    textPadding: "pl-4 pr-2.5",
    icon: "h-[38px] w-[38px]",
    iconSize: "h-[16px] w-[16px]",
    outer: "m-[3px]",
  },

  md: {
    text: "text-[16px]",
    font: "font-semibold",
    textPadding: "pl-5 pr-3",
    icon: "h-[46px] w-[46px]",
    iconSize: "h-[18px] w-[18px]",
    outer: "m-[4px]",
  },

  lg: {
    text: "text-[18px]",
    font: "font-semibold",
    textPadding: "pl-6 pr-4",
    icon: "h-[52px] w-[52px]",
    iconSize: "h-[20px] w-[20px]",
    outer: "m-[4px]",
  },

  xl: {
    text: "text-[22px]",
    font: "font-semibold",
    textPadding: "pl-7 pr-5",
    icon: "h-[60px] w-[60px]",
    iconSize: "h-[24px] w-[24px]",
    outer: "m-[5px]",
  },
};

const menuItems = ["Menu", "Work", "About", "Contact"];

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

  className,
  iconClassName,

  onClick,
}: NeoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isMenu = variant === "menu";

  const currentSize = sizes[size];

  const currentColor = colorVariants[color];

  const handleClick = () => {
    if (isMenu) {
      setIsOpen((prev) => !prev);
    }

    onClick?.();
  };

  return (
    <div className="relative w-fit">
      {/* BUTTON */}
      <motion.button
        initial="rest"
        whileHover="hover"
        animate="rest"
        onClick={handleClick}
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
        {/* TEXT */}
        <motion.span
          variants={{
            rest: {
              x: 0,
            },

            hover: {
              x: -2,

              transition: {
                type: "spring",
                stiffness: 500,
                damping: 14,
              },
            },
          }}
          className={cn(
            `
            whitespace-nowrap
            leading-none
            tracking-[-0.03em]
            `,
            currentSize.text,
            currentSize.font,

            icon ? currentSize.textPadding : "px-6 py-4",
          )}
        >
          {children}
        </motion.span>

        {/* ICON */}
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
              rounded-full
              `,
              currentSize.icon,
              currentSize.outer,

              currentColor.iconBg,

              iconClassName,
            )}
          >
            {customIcon ? (
              customIcon
            ) : isMenu && isOpen ? (
              <X strokeWidth={2.2} className={currentSize.iconSize} />
            ) : isMenu ? (
              <Menu strokeWidth={2.2} className={currentSize.iconSize} />
            ) : (
              <MessageSquare
                strokeWidth={2.2}
                className={currentSize.iconSize}
              />
            )}
          </div>
        )}
      </motion.button>

      {/* MENU DROPDOWN */}
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
            <div
              className="
                flex
                flex-col
                gap-2
              "
            >
              {menuItems.map((item, index) => (
                <motion.button
                  key={item}
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
                    duration-200

                    hover:bg-white/50
                    hover:opacity-60

                    sm:text-[52px]
                  "
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
