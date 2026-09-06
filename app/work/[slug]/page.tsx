import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { projects } from "@/data/projects";

import ProjectHero from "@/components/layout/ProjectHero";
import ProjectGallery from "@/components/layout/ProjectGallery";
import NextProject from "@/components/layout/NextProject";
import NeoButton from "@/components/ui/neo-button";
import { FlowButton } from "@/components/ui/flow-button";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  const project = projects[slug];

  if (!project) {
    return null;
  }

  const nextProject = projects[project.nextProject.slug];

  return (
    <main className="relative overflow-hidden bg-[#111111] text-[#f5f5f5]">
      {/* BACK TO WORK */}

      {/* PROJECT */}

      <ProjectHero project={project} />

      <ProjectGallery project={project} />

      <NextProject project={nextProject} />
    </main>
  );
}
