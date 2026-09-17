"use client";

import { forwardRef } from "react";

import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

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
        relative
        min-h-screen
        w-full
        bg-[#f2f2f2]
        px-5
        text-[#111111]
        md:px-8
        lg:px-10
      "
      >
        <Link
          href={`/work/${slug}`}
          className="
          next-project-content
          group
          flex
          min-h-screen
          flex-col
          justify-between
          py-8
          md:py-10
        "
        >
          {/* ================================================================
            HEADER
            ================================================================ */}

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
            <span>Next project</span>

            <ArrowUpRight
              size={18}
              strokeWidth={1.3}
              className="
              transition-transform
              duration-500
              group-hover:translate-x-1
              group-hover:-translate-y-1
            "
            />
          </div>

          {/* ================================================================
            PROJECT INFO
            ================================================================ */}

          <div>
            <p
              className="
              mb-6
              text-[10px]
              uppercase
              tracking-[0.08em]
              text-black/40
            "
            >
              {project.category} · {project.year}
            </p>

            <h2
              className="
              text-[clamp(4rem,15vw,18rem)]
              font-medium
              leading-[0.72]
              tracking-[-0.085em]
            "
            >
              {project.title}
            </h2>
          </div>

          {/* ================================================================
            FOOTER
            ================================================================ */}

          <div className="flex justify-end">
            <span
              className="
              text-[9px]
              uppercase
              tracking-[0.12em]
            "
            >
              View project
            </span>
          </div>
        </Link>
      </section>
    );
  },
);

NextProject.displayName = "NextProject";

export default NextProject;
