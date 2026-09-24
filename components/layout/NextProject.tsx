"use client";

import { forwardRef } from "react";

import { ArrowUpRight } from "lucide-react";

import Link from "next/link";

import type { Project } from "@/data/projects";

type NextProjectProps = {
  project: Project;
  slug: string;
};

const NextProject = forwardRef<HTMLElement, NextProjectProps>(
  ({ project, slug }, ref) => {
    return (
      <section
        ref={ref}
        data-logo-trigger
        className="
        absolute
        inset-0
        z-20
        min-h-screen
        w-full
        overflow-hidden
        bg-[#f2f2f2]
        text-[#111111]
        max-md:relative
        max-md:z-auto
      "
      >
        <Link
          href={`/work/${slug}`}
          className="
          next-project-content
          relative
          block
          min-h-screen
          w-full
          overflow-hidden
        "
        >
          {/* =====================================================
            BACKGROUND STATEMENT
        ===================================================== */}

          <div
            className="
            next-project-statement
            relative
            z-10
            flex
            min-h-screen
            w-full
            flex-col
            justify-between
            px-6
            py-8
            md:px-12
            md:py-10
            lg:px-16
          "
          >
            {/* TOP */}

            <div
              className="
              flex
              items-center
              justify-between
              border-b
              border-black/10
              pb-4
              text-[9px]
              uppercase
              tracking-[0.12em]
            "
            >
              <span>Next</span>

              <span>Project</span>
            </div>

            {/* STATEMENT */}

            <div
              className="
              w-[70%]
              max-w-[1000px]
              pr-8
              md:pr-12
              lg:pr-20
            "
            >
              <p
                className="
                text-[clamp(2.75rem,5.5vw,7rem)]
                font-medium
                leading-[0.88]
                tracking-[-0.055em]
              "
              >
                We create digital experiences that turn ideas into something
                people remember.
              </p>
            </div>

            {/* BOTTOM */}

            <div
              className="
              flex
              items-end
              justify-between
              text-[9px]
              uppercase
              tracking-[0.12em]
            "
            >
              <span>Let&apos;s make something</span>

              <ArrowUpRight size={18} strokeWidth={1.3} />
            </div>
          </div>

          {/* =====================================================
            TEXT PANEL
        ===================================================== */}

          <div
            className="
            next-project-panel
            absolute
            inset-y-0
            right-0
            z-20
            flex
            w-[30%]
            min-h-screen
            flex-col
            justify-between
            overflow-hidden
            bg-[#f2f2f2]
            px-8
            py-8
            md:px-12
            md:py-10
            lg:px-16
            will-change-[width]
          "
          >
            <div
              className="
              next-project-panel-inner
              flex
              min-h-full
              flex-col
              justify-between
            "
            >
              {/* TOP */}

              <div
                className="
                flex
                items-center
                justify-between
                border-b
                border-black/10
                pb-3
                text-[9px]
                uppercase
                tracking-[0.12em]
              "
              >
                <span>Next project</span>

                <ArrowUpRight size={18} strokeWidth={1.3} />
              </div>

              {/* TITLE GROUP */}

              <div
                className="
                next-project-title-group
                w-[36rem]
                max-w-none
              "
              >
                {/* CATEGORY + YEAR */}

                <div
                  className="
                  next-project-category
                  mb-8
                  flex
                  items-center
                  gap-3
                  whitespace-nowrap
                  text-[9px]
                  uppercase
                  tracking-[0.15em]
                  md:text-[10px]
                "
                >
                  <span>{project.category}</span>

                  <span
                    className="
                    h-px
                    w-7
                    shrink-0
                    bg-current
                    opacity-20
                  "
                  />

                  <span>{project.year}</span>
                </div>

                {/* TITLE */}

                <h2
                  className="
                  next-project-title
                  w-full
                  font-aeonik
                  text-6xl
                  font-regular
                  leading-[0.8]
                  tracking-normal
                  max-md:text-5xl
                  max-md:leading-[0.85]
                "
                >
                  {project.title}
                </h2>
              </div>

              {/* BOTTOM */}

              <div
                className="
                flex
                items-center
                justify-between
                text-[9px]
                uppercase
                tracking-[0.12em]
              "
              >
                <span>View project</span>

                <span>↗</span>
              </div>
            </div>
          </div>
        </Link>
      </section>
    );
  },
);

NextProject.displayName = "NextProject";

export default NextProject;
