import projectsData from "./projects.json";

export type ProjectGalleryItem = {
  src: string;
  alt: string;
  size: "small" | "medium" | "large";
};

export type Project = {
  title: string;
  category: string;
  year: string;

  description: string;

  services: string[];

  role: string;
  platform: string;

  hero: {
    src: string;
    alt: string;
  };

  gallery: ProjectGalleryItem[];

  nextProject: {
    slug: string;
  };
};

export const projects =
  projectsData as Record<string, Project>;