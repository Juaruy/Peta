import projectsData from "./projects.json";

export type ProjectGalleryItem = {
  src: string;
  alt: string;
  size: "small" | "medium" | "large";
};

export type ProjectTheme = {
  background: string;
  backgroundOpacity: number;
  logo: string;
};

export type Project = {
  title: string;
  category: string;
  year: string;

  // Determines the text color system used by the project hero.
  heroTheme: "light" | "dark";

  theme: ProjectTheme;

  description: string;
  link: string;
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

export const projects = projectsData as Record<string, Project>;