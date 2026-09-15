"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import { ArrowLeft, Menu as MenuIcon } from "lucide-react";

import NeoButton from "@/components/ui/neo-button";

import MusicPlayer from "../ui/MusicPlayer";

export default function Navbar() {
  const [isLogoTriggerVisible, setIsLogoTriggerVisible] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  const isProjectDetail =
    pathname.startsWith("/work/") &&
    pathname.split("/").filter(Boolean).length === 2;

  useEffect(() => {
    const logoTriggers = document.querySelectorAll("[data-logo-trigger]");
    const visibleTriggers = new Set<Element>();

    const handleScroll = () => {
      setIsAtTop(window.scrollY <= 10);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    if (logoTriggers.length === 0) {
      setIsLogoTriggerVisible(false);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleTriggers.add(entry.target);
          } else {
            visibleTriggers.delete(entry.target);
          }
        });

        setIsLogoTriggerVisible(visibleTriggers.size > 0);
      },
      {
        threshold: 0.1,
      },
    );

    logoTriggers.forEach((trigger) => {
      observer.observe(trigger);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      visibleTriggers.clear();
    };
  }, [pathname]);

  const showLogo = isAtTop || isLogoTriggerVisible;

  return (
    <div
      className="
        fixed
        z-50
        flex
        w-full
        items-center
        justify-center
        px-6
        py-4
        md:px-12
        md:py-8
        lg:px-16
      "
    >
      <header
        className="
          relative
          mx-auto
          flex
          h-24
          w-full
          items-center
          justify-between
        "
      >
        {/* ==========================================================
            LOGO
            ========================================================== */}

        <div
          className={`
            relative
            h-10
            w-[140px]
            transition-all
            duration-500
            ease-out
            md:h-12
            md:w-[170px]
            ${
              showLogo
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-4 opacity-0"
            }
          `}
        >
          <Link href="/" aria-label="Home">
            <Image
              src="/LogoPeta.svg"
              alt="Logo"
              fill
              priority
              className={`
                object-contain
                object-left
                transition-all
                duration-300
                ${isLogoTriggerVisible ? "invert" : ""}
              `}
            />
          </Link>
        </div>

        {/* ==========================================================
            DESKTOP BACK BUTTON
            ========================================================== */}

        {isProjectDetail && (
          <div
            className="
              absolute
              left-1/2
              top-1/2
              hidden
              -translate-x-1/2
              -translate-y-1/2
              md:block
            "
          >
            <NeoButton
              variant="global-action"
              color="primary"
              size="xl"
              customIcon={<ArrowLeft size={17} />}
              iconPosition="left"
              onClick={() => router.back()}
            >
              Back
            </NeoButton>
          </div>
        )}

        {/* ==========================================================
            RIGHT ACTIONS
            ========================================================== */}

        <div
          className="
            flex
            w-fit
            items-center
            gap-2
          "
        >
          {/* ========================================================
              MUSIC
              ======================================================== */}

          <MusicPlayer />

          {/* ========================================================
              MOBILE BACK BUTTON
              ======================================================== */}

          {isProjectDetail && (
            <NeoButton
              variant="global-action"
              color="primary"
              size="xl"
              customIcon={<ArrowLeft size={17} />}
              iconPosition="left"
              onClick={() => router.back()}
              className="md:hidden"
            >
              {null}
            </NeoButton>
          )}

          {/* ========================================================
              LET'S TALK
              ======================================================== */}

          <NeoButton
            variant="global"
            color="secondary"
            size="xl"
            className="hidden md:inline-flex"
          >
            Let's Talk
          </NeoButton>

          {/* ========================================================
              MENU
              ======================================================== */}

          <NeoButton
            variant="menu"
            size="xl"
            color="primary"
            customIcon={<MenuIcon size={18} />}
            className="
              !h-12
              !w-12
              !min-w-0
              !p-0
              md:!h-auto
              md:!w-auto
              md:!p-auto
            "
          >
            <span className="hidden md:inline">Menu</span>
          </NeoButton>
        </div>
      </header>
    </div>
  );
}
