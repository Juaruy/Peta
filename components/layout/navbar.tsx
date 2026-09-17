"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import { ArrowLeft, Menu as MenuIcon } from "lucide-react";

import { projects } from "@/data/projects";

import NeoButton from "@/components/ui/neo-button";

import MusicPlayer from "../ui/MusicPlayer";

export default function Navbar() {
  const [isLogoTriggerVisible, setIsLogoTriggerVisible] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  /* ================================================================
     PATH
     ================================================================ */

  const pathSegments = pathname.split("/").filter(Boolean);

  const isProjectDetail =
    pathname.startsWith("/work/") && pathSegments.length === 2;

  /* ================================================================
     PROJECT THEME

     Theme hanya digunakan pada /work/[slug].
     Page lain tetap menggunakan warna logo default.
     ================================================================ */

  const projectSlug = isProjectDetail ? pathSegments[1] : null;
  const project = projectSlug ? projects[projectSlug] : null;

  /* ================================================================
     LOGO COLOR

     Default:
     → putih

     Project detail:
     → theme.logo

     NextProject / data-logo-trigger:
     → hitam
     ================================================================ */

  const defaultLogoColor = "#FFFFFF";

  const projectLogoColor = project?.theme.logo ?? defaultLogoColor;

  const logoColor = isLogoTriggerVisible ? "#111111" : projectLogoColor;

  /* ================================================================
     LOGO VISIBILITY
     ================================================================ */

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

    /* ============================================================
       Reset trigger state ketika pindah halaman
       ============================================================ */

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
        {/* =====================================================
            LOGO
            ===================================================== */}

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
          <Link
            href="/"
            aria-label="Home"
            className="
              block
              h-full
              w-full
            "
          >
            <span
              aria-hidden="true"
              className="
                block
                h-full
                w-full
                transition-colors
                duration-300
              "
              style={{
                backgroundColor: logoColor,
                maskImage: "url('/LogoPeta.svg')",
                WebkitMaskImage: "url('/LogoPeta.svg')",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "left center",
                WebkitMaskPosition: "left center",
                maskSize: "contain",
                WebkitMaskSize: "contain",
              }}
            />
          </Link>
        </div>

        {/* =====================================================
            DESKTOP BACK BUTTON
            ===================================================== */}

        {isProjectDetail && (
          <div
            className="
              absolute
              left-1/2
              top-1/2
              hidden
              -translate-x-1/2
              -translate-y-1/2
              md:inline-flex
            "
          >
            <NeoButton
              variant="global-action"
              color="primary"
              size="lg"
              customIcon={<ArrowLeft size={17} />}
              iconPosition="left"
              onClick={() => router.back()}
            >
              Back
            </NeoButton>
          </div>
        )}

        {/* =====================================================
            RIGHT ACTIONS
            ===================================================== */}

        <div
          className="
            flex
            w-fit
            items-center
            gap-2
          "
        >
          <MusicPlayer />

          {/* =================================================
              MOBILE BACK BUTTON
              ================================================= */}

          {isProjectDetail && (
            <div className="inline-flex md:hidden">
              <NeoButton
                variant="global-action"
                color="primary"
                size="md"
                customIcon={<ArrowLeft size={17} />}
                iconPosition="only"
                onClick={() => router.back()}
              >
                {null}
              </NeoButton>
            </div>
          )}

          {/* =================================================
              LET'S TALK
              ================================================= */}

          <NeoButton
            variant="global"
            color="secondary"
            size="lg"
            className="hidden md:inline-flex"
          >
            Let's Talk
          </NeoButton>

          {/* =================================================
              MENU
              ================================================= */}

          {/* DESKTOP MENU */}

          <div className="hidden md:inline-flex">
            <NeoButton
              variant="menu"
              size="lg"
              color="primary"
              customIcon={<MenuIcon size={18} />}
              iconPosition="right"
            >
              Menu
            </NeoButton>
          </div>

          {/* MOBILE MENU */}

          <div className="inline-flex md:hidden">
            <NeoButton
              variant="menu"
              size="md"
              color="primary"
              customIcon={<MenuIcon size={17} />}
              iconPosition="only"
            >
              {null}
            </NeoButton>
          </div>
        </div>
      </header>
    </div>
  );
}
