/**
 * Identidad y SEO.
 * Cuando exista el dominio de producción, definí NEXT_PUBLIC_SITE_URL
 * (por ejemplo https://gabriellloveras.dev) para canonical, Open Graph y sitemap.
 */
export const site = {
  name: "Gabriel Lloveras",
  role: "Fullstack Developer",
  title: "Gabriel Lloveras — Fullstack Developer",
  description: {
    es: "Portfolio de Gabriel Lloveras, Fullstack Developer en Mendoza, Argentina. React, TypeScript y Next.js en frontend; Java, C# y Node.js en backend.",
    en: "Portfolio of Gabriel Lloveras, Fullstack Developer in Mendoza, Argentina. React, TypeScript, and Next.js on the frontend; Java, C#, and Node.js on the backend.",
  },
  email: "gabriellloveras@gmail.com",
  linkedin: "https://www.linkedin.com/in/gabriel-lloveras/",
  linkedinLabel: "linkedin.com/in/gabriel-lloveras/",
  location: "Mendoza, Argentina",
  locationShort: "Mendoza, AR",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "",
} as const;

