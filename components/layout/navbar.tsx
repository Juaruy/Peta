"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import NeoButton from "@/components/ui/neo-button";

import MusicPlayer from "../ui/MusicPlayer";

export default function Navbar() {
  const [isContactVisible, setIsContactVisible] = useState(false);

  const [isHeroVisible, setIsHeroVisible] = useState(true);

  const pathname = usePathname();

  const router = useRouter();

  // Detect page detail project: /work/[slug]
  const isProjectDetail =
    pathname.startsWith("/work/") &&
    pathname.split("/").filter(Boolean).length === 2;

  useEffect(() => {
    const contact = document.getElementById("contact");

    const hero = document.getElementById("hero");

    const observers: IntersectionObserver[] = [];

    if (contact) {
      const contactObserver = new IntersectionObserver(
        ([entry]) => {
          setIsContactVisible(entry.isIntersecting);
        },
        {
          threshold: 0.1,
        },
      );

      contactObserver.observe(contact);

      observers.push(contactObserver);
    }

    if (hero) {
      const heroObserver = new IntersectionObserver(
        ([entry]) => {
          setIsHeroVisible(entry.isIntersecting);
        },
        {
          threshold: 0.1,
        },
      );

      heroObserver.observe(hero);

      observers.push(heroObserver);
    }

    return () => {
      observers.forEach((observer) => {
        observer.disconnect();
      });
    };
  }, []);

  const showLogo = isHeroVisible || isContactVisible;

  return (
    /* OUTER WRAPPER */
    <div
      className="
        fixed
        z-50
        w-full
        px-8
        py-4
        md:py-8
        md:px-12
        lg:px-16
        items-center
        justify-center
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
        {/* LEFT / LOGO */}
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
          <Link href="#hero" aria-label="Home">
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
                ${isContactVisible ? "invert" : ""}
              `}
            />
          </Link>
        </div>

        {/* CENTER / BACK BUTTON */}
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

        {/* RIGHT */}
        <div
          className="
            flex
            w-fit
            items-center
            gap-2
          "
        >
          <MusicPlayer />

          <NeoButton
            variant="global"
            color="secondary"
            size="xl"
            className="hidden md:inline-flex"
          >
            Let's Talk
          </NeoButton>

          <NeoButton variant="menu" size="xl" color="primary">
            Menu
          </NeoButton>
        </div>
      </header>
    </div>
  );
}
