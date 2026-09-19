"use client";

import Image from "next/image";

import { useRouter } from "next/navigation";

import { Bot } from "lucide-react";

import type { Project } from "@/data/projects";

import NeoButton from "../ui/neo-button";

type DetailProjectProps = {
  project: Project;
};

export default function DetailProject({ project }: DetailProjectProps) {
  const router = useRouter();

  // ========================================================================
  // HERO THEME
  // ========================================================================

  const heroIsLight = project.heroTheme === "light";

  return (
    <section
      className="
        project-detail
        relative
        flex
        w-full
        shrink-0
        items-center
        max-md:block
      "
    >
      <div
        className="
          project-detail-container
          relative
          mx-auto
          flex
          w-max
          items-center
          max-md:w-full
          max-md:flex-col
          max-md:items-stretch
          max-md:px-6
          max-md:pb-6
        "
      >
        {/* =====================================================
            HERO
        ===================================================== */}

        <div
          className="
            project-hero
            relative
            z-10
            flex
            shrink-0
            items-center
            px-8
            py-32
            md:px-12
            md:py-24
            lg:px-16
            max-md:w-full
            max-md:min-h-[85vh]
            max-md:px-0
            max-md:py-24
          "
        >
          <div
            className="
              project-hero-content
              relative
              z-10
              w-full
              max-w-xl
              will-change-transform
            "
          >
            {/* =================================================
                CATEGORY + YEAR
            ================================================= */}

            <div
              className={`
                mb-8
                flex
                items-center
                gap-3
                text-[9px]
                uppercase
                tracking-[0.15em]
                transition-colors
                duration-300
                ${heroIsLight ? "text-black/40" : "text-white/40"}
                md:text-[10px]
                max-md:mb-6
                max-md:text-[8px]
              `}
            >
              <span>{project.category}</span>

              <span
                className={`
                  h-px
                  w-7
                  transition-colors
                  duration-300
                  ${heroIsLight ? "bg-black/20" : "bg-white/20"}
                `}
              />

              <span>{project.year}</span>
            </div>

            {/* =================================================
                TITLE
            ================================================= */}

            <h1
              className={`
                font-aeonik
                text-6xl
                font-regular
                leading-[0.8]
                transition-colors
                duration-300
                ${heroIsLight ? "text-black" : "text-white"}
                max-md:text-5xl
                max-md:leading-[0.85]
              `}
            >
              {project.title}
            </h1>

            {/* =================================================
                CONTENT WRAPPER

                DESKTOP:
                Description | Meta
                CTA         | Meta

                MOBILE:
                Description
                Meta
                CTA
            ================================================= */}

            <div
              className="
                mt-10
                grid
                max-w-md
                grid-cols-[minmax(0,1fr)_auto]
                items-start
                gap-x-12
                gap-y-8
                max-md:flex
                max-md:flex-col
                max-md:gap-8
                max-md:mt-8
              "
            >
              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <div
                className="
                  min-w-0
                  max-md:order-1
                "
              >
                <p
                  className={`
                    text-xs
                    leading-[1.7]
                    transition-colors
                    duration-300
                    ${heroIsLight ? "text-black/50" : "text-white/50"}
                    md:text-base
                    max-md:text-[11px]
                    max-md:leading-[1.7]
                  `}
                >
                  {project.description}
                </p>
              </div>

              {/* =================================================
                  META
              ================================================= */}

              <div
                className="
                  row-span-2
                  flex
                  shrink-0
                  flex-col
                  gap-8
                  max-md:order-2
                  max-md:flex-row
                  max-md:items-start
                  max-md:gap-12
                "
              >
                {/* =================================================
                    SERVICES
                ================================================= */}

                <div>
                  <span
                    className={`
                      mb-3
                      block
                      text-[9px]
                      uppercase
                      tracking-[0.15em]
                      transition-colors
                      duration-300
                      ${heroIsLight ? "text-black/30" : "text-white/30"}
                      md:text-xs
                    `}
                  >
                    Services
                  </span>

                  <div className="space-y-1">
                    {project.services.map((service) => (
                      <p
                        key={service}
                        className={`
                          text-[11px]
                          transition-colors
                          duration-300
                          ${heroIsLight ? "text-black/65" : "text-white/65"}
                          md:text-xs
                          max-md:text-[10px]
                        `}
                      >
                        {service}
                      </p>
                    ))}
                  </div>
                </div>

                {/* =================================================
                    PLATFORM
                ================================================= */}

                <div>
                  <span
                    className={`
                      mb-3
                      block
                      text-[9px]
                      uppercase
                      tracking-[0.15em]
                      transition-colors
                      duration-300
                      ${heroIsLight ? "text-black/30" : "text-white/30"}
                      md:text-xs
                    `}
                  >
                    Platform
                  </span>

                  <p
                    className={`
                      text-[11px]
                      transition-colors
                      duration-300
                      ${heroIsLight ? "text-black/65" : "text-white/65"}
                      md:text-xs
                      max-md:text-[10px]
                    `}
                  >
                    {project.platform}
                  </p>
                </div>
              </div>

              {/* =================================================
                  CTA
              ================================================= */}

              <div className="relative max-md:order-3">
                <div className="flex justify-start">
                  <NeoButton
                    variant="global-action"
                    color="primary"
                    iconPosition="left"
                    customIcon={<Bot size={17} />}
                    className="mt-0"
                    size={{
                      base: "sm",
                      md: "md",
                      lg: "lg",
                    }}
                    onClick={() => router.push(project.link)}
                  >
                    Launch Project
                  </NeoButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            GALLERY
        ===================================================== */}

        {project.gallery.map((image, index) => {
          const size =
            image.size === "large"
              ? "h-[82vh] w-[70vw]"
              : image.size === "medium"
                ? "h-[72vh] w-[52vw]"
                : "h-[65vh] w-[70vw]";

          return (
            <div
              key={image.src}
              className={`
                project-gallery-item
                relative
                z-20
                shrink-0
                overflow-hidden
                rounded-2xl
                2xl:rounded-[32px]
                3xl:rounded-[40px]
                ${size}
                ml-[8vw]
                max-md:mx-auto
                max-md:mt-6
                max-md:h-[55vw]
                max-md:w-[calc(100vw-3rem)]
                max-md:shrink
                max-md:rounded-2xl
              `}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="
                  (max-width: 767px) calc(100vw - 3rem),
                  80vw
                "
                className="
                  project-gallery-image
                  h-full
                  w-full
                  object-cover
                "
              />

              <div
                className="
                  absolute
                  bottom-4
                  left-4
                  text-[9px]
                  uppercase
                  tracking-[0.12em]
                  text-white/50
                  max-md:bottom-3
                  max-md:left-3
                  max-md:text-[8px]
                "
              >
                0{index + 1}
              </div>
            </div>
          );
        })}

        {/* =====================================================
            END SPACING
        ===================================================== */}

        <div
          className="
            h-full
            w-[8vw]
            shrink-0
            max-md:hidden
          "
        />
      </div>
    </section>
  );
}
