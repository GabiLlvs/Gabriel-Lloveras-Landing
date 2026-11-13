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
    slug: "moshtify",
    title: "moshtify",
    summary: {
      es: "Generador de flyers para shows: cargás bandas, lugar, fecha y entradas, elegís uno de seis estilos y descargás el flyer como historia (1080 × 1920) y post (1080 × 1350) de Instagram. Lo desarrollé con Next.js, React, TypeScript, Zustand y html-to-image; funciona entero en el navegador, sin cuentas, en español e inglés.",
      en: "A flyer generator for live shows: enter the bands, venue, date, and tickets, pick one of six styles, and download the flyer as an Instagram story (1080 × 1920) and feed post (1080 × 1350). I built it with Next.js, React, TypeScript, Zustand, and html-to-image; it runs entirely in the browser, with no accounts, in Spanish and English.",
    },
    links: [
      {
        label: { es: "Abrir app", en: "Open app" },
        href: "https://moshtify.vercel.app/",
      },
      {
        label: { es: "Ver repositorio", en: "View repository" },
        href: "https://github.com/GabiLlvs/moshtify",
      },
    ],
  },
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
