"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NeoButton from "@/components/ui/neo-button";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
              isScrolled
                ? "pointer-events-none -translate-y-4 opacity-0"
                : "translate-y-0 opacity-100"
            }
          `}
        >
          <Link href="/" aria-label="Home">
            <Image
              src="/LogoPeta.svg"
              alt="Logo"
              fill
              priority
              className="object-contain object-left"
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
