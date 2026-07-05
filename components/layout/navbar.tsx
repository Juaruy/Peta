"use client";

import Image from "next/image";
import Link from "next/link";
import NeoButton from "@/components/ui/neo-button";

export default function Navbar() {
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
        {/* LEFT */}
        <div
          className="
    relative
    h-10
    w-[140px]

    md:h-12
    md:w-[170px]
  "
        >
          <Link href="/" aria-label="Home">
            <Image
              src="/LogoPeta.svg"
              alt="Logo"
              fill
              priority
              className="object-contain"
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
