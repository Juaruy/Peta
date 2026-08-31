"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import Link from "next/link";

import NeoButton from "@/components/ui/neo-button";

import MusicPlayer from "../ui/MusicPlayer";

export default function Navbar() {
  const [isContactVisible, setIsContactVisible] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

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
            size="sm"
            className="
              hidden
              md:inline-flex
              md:[&>span]:text-[15px]
              lg:[&>span]:text-[17px]
            "
            iconClassName="
              md:h-[42px] md:w-[42px]
              lg:h-[50px] lg:w-[50px]
            "
          >
            Let&apos;s Talk
          </NeoButton>

          <NeoButton
            variant="menu"
            size="sm"
            color="primary"
            className="
              md:[&>span]:text-[15px]
              lg:[&>span]:text-[17px]
            "
            iconClassName="
              md:h-[42px] md:w-[42px]
              lg:h-[50px] lg:w-[50px]
            "
          >
            Menu
          </NeoButton>
        </div>
      </header>
    </div>
  );
}
