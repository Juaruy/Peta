"use client";

import Image from "next/image";

import type { Project } from "@/data/projects";

type ProjectHeroProps = {
  project: Project;
};

export default function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <section className="relative min-h-screen w-full px-6  text-white md:px-12 lg:px-6">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[0.8fr_1.2fr]">
        {/* LEFT */}
        <div className="flex items-center px-5 pb-16 pt-32 md:px-8 lg:px-10 lg:pb-10 lg:pt-24">
          <div className="w-full max-w-xl">
            <div className="mb-8 flex items-center gap-3 text-[9px] uppercase tracking-[0.15em] text-white/40 md:text-[10px]">
              <span>{project.category}</span>

              <span className="h-px w-7 bg-white/20" />

              <span>{project.year}</span>
            </div>

            <h1 className="text-6xl font-aeonik font-medium leading-[0.8]">
              {project.title}
            </h1>

            {/* DESCRIPTION + SERVICES + PLATFORM */}
            <div className="mt-10 flex max-w-md gap-12">
              {/* DESCRIPTION */}
              <p className="text-[12px] leading-[1.7] text-white/50 md:text-sm">
                {project.description}
              </p>

              {/* SERVICES + PLATFORM */}
              <div className="flex shrink-0 flex-col gap-8">
                {/* SERVICES */}
                <div>
                  <span className="mb-3 block text-[9px] uppercase tracking-[0.15em] text-white/30">
                    Services
                  </span>

                  <div className="space-y-1">
                    {project.services.map((service) => (
                      <p
                        key={service}
                        className="text-[11px] text-white/65 md:text-xs"
                      >
                        {service}
                      </p>
                    ))}
                  </div>
                </div>

                {/* PLATFORM */}
                <div>
                  <span className="mb-3 block text-[9px] uppercase tracking-[0.15em] text-white/30">
                    Platform
                  </span>

                  <p className="text-[11px] text-white/65 md:text-xs">
                    {project.platform}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div className="relative min-h-[70vh] lg:min-h-screen">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={project.hero.src}
              alt={project.hero.alt}
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
