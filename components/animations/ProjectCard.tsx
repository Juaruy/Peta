"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";

interface ProjectCardProps {
  title: string;
  category: string;
  year: string;
  href: string;
  image?: string;
  color?: string;
  description?: string;
}

export default function ProjectCard({
  title,
  category,
  year,
  href,
  image,
  color = "#e8e5df",
  description,
}: ProjectCardProps) {
  const folderRef = useRef<HTMLAnchorElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (!folderRef.current) return;

    gsap.to(folderRef.current, {
      y: -8,
      duration: 0.45,
      ease: "power3.out",
    });

    gsap.to(tabRef.current, {
      y: -5,
      duration: 0.45,
      ease: "power3.out",
    });

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1.04,
        duration: 0.7,
        ease: "power3.out",
      });
    }
  };

  const handleLeave = () => {
    if (!folderRef.current) return;

    gsap.to(folderRef.current, {
      y: 0,
      duration: 0.5,
      ease: "power3.out",
    });

    gsap.to(tabRef.current, {
      y: 0,
      duration: 0.5,
      ease: "power3.out",
    });

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
      });
    }
  };

  return (
    <Link
      ref={folderRef}
      href={href}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="
        relative
        block
        w-full
        cursor-pointer
        outline-none
      "
    >
      {/* FOLDER TAB */}
      <div
        ref={tabRef}
        className="
          relative
          z-[2]
          flex
          h-[58px]
          w-fit
          min-w-[180px]
          items-center
          rounded-t-[18px]
          px-7
          text-black
          md:h-[68px]
          md:min-w-[240px]
          md:px-9
        "
        style={{
          backgroundColor: color,
        }}
      >
        <span
          className="
            text-sm
            font-medium
            uppercase
            tracking-[0.04em]
            md:text-base
          "
        >
          {title}
        </span>
      </div>

      {/* FOLDER BODY */}
      <div
        className="
          relative
          z-[1]
          min-h-[360px]
          w-full
          overflow-hidden
          rounded-b-[20px]
          rounded-tr-[20px]
          border
          border-black/10
          text-black
          md:min-h-[460px]
        "
        style={{
          backgroundColor: color,
        }}
      >
        {/* IMAGE */}
        {image && (
          <div className="absolute inset-0 overflow-hidden">
            <div ref={imageRef} className="absolute inset-0">
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-cover"
              />
            </div>

            {/* IMAGE OVERLAY */}
            <div className="absolute inset-0 bg-black/10" />
          </div>
        )}

        {/* CONTENT */}
        <div
          className={`
            relative
            z-[2]
            flex
            min-h-[360px]
            flex-col
            justify-between
            p-6
            md:min-h-[460px]
            md:p-10
            ${image ? "text-white" : "text-black"}
          `}
        >
          {/* TOP */}
          <div className="flex items-start justify-between gap-6">
            <span className="text-xs uppercase tracking-[0.14em] opacity-60 md:text-sm">
              {category}
            </span>

            <span className="text-xs uppercase tracking-[0.14em] opacity-60 md:text-sm">
              {year}
            </span>
          </div>

          {/* BOTTOM */}
          <div className="max-w-[720px]">
            {description && (
              <p className="mb-6 max-w-[620px] text-base leading-[1.5] opacity-80 md:text-xl">
                {description}
              </p>
            )}

            <div className="flex items-end justify-between gap-6">
              <h3
                className="
                  text-4xl
                  font-semibold
                  leading-[0.9]
                  tracking-[-0.04em]
                  md:text-6xl
                  lg:text-7xl
                "
              >
                {title}
              </h3>

              <span className="shrink-0 text-2xl transition-transform duration-300 group-hover:translate-x-1">
                ↗
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
