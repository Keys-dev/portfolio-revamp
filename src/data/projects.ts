import data from "./projects.json";
export interface Project {
  id: string;
  slug: string;
  title: string;
  year: string;
  category: string;
  theme: string;
  summary: string;
  description: string;
  tags: string[];
  link: string;
  cover: string;
  screens: { file: string; caption: string }[];
}
export const projects: Project[] = data;
export const findProject = (slug: string | undefined) =>
  projects.find((project) => project.slug === slug);
