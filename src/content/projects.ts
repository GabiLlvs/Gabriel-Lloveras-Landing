export type ProjectImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type ProjectLink = {
  label: string;
  href: string;
};

/**
 * Catálogo de proyectos. Agregá objetos a `projects`.
 * No completes datos que no existan: omití el campo.
 * Si una entrada todavía está incompleta, marcala con `placeholder: true`
 * para que la interfaz la señale como pendiente.
 *
 * Imágenes: guardalas en `public/projects/<slug>/` y referencialas como
 * `/projects/<slug>/01.png`.
 *
 * Ejemplo:
 * {
 *   slug: "mi-proyecto",
 *   title: "Nombre visible",
 *   summary: "Qué es, en una o dos frases.",
 *   problem: "Qué problema resolvía.",
 *   contribution: "Qué hiciste vos.",
 *   highlights: ["Característica real"],
 *   stack: ["React", "TypeScript", "Next.js"],
 *   images: [{ src: "/projects/mi-proyecto/01.png", alt: "Descripción de la captura" }],
 *   links: [{ label: "Repositorio", href: "https://github.com/..." }],
 * }
 */
export type Project = {
  slug: string;
  title: string;
  summary: string;
  problem?: string;
  contribution?: string;
  highlights?: string[];
  stack: string[];
  images?: ProjectImage[];
  links?: ProjectLink[];
  placeholder?: boolean;
};

export const projects: Project[] = [];
