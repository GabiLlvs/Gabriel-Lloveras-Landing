import type { Locale } from "@/content/locale";

export type ProjectLink = {
  label: Record<Locale, string>;
  href: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: Record<Locale, string>;
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: "charlie-bot",
    title: "Charlie-bot",
    summary: {
      es: "Bot personal para WhatsApp que recibe fotos, GIFs y videos cortos y los devuelve como stickers WebP de hasta 512 × 512 px. Lo desarrollé con Node.js, Baileys, Sharp y FFmpeg, y preparé su despliegue con Docker.",
      en: "A personal WhatsApp bot that receives photos, GIFs, and short videos and returns them as WebP stickers up to 512 × 512 px. I built it with Node.js, Baileys, Sharp, and FFmpeg, and prepared its Docker deployment.",
    },
    links: [
      {
        label: { es: "Ver landing", en: "View landing page" },
        href: "https://charlie-bot-portfolio.vercel.app/",
      },
      {
        label: { es: "Ver repositorio", en: "View repository" },
        href: "https://github.com/GabiLlvs/Charlie-bot",
      },
    ],
  },
];
