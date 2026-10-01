/**
 * Identidad y SEO.
 * Cuando exista el dominio de producción, definí NEXT_PUBLIC_SITE_URL
 * (por ejemplo https://gabriellloveras.dev) para canonical, Open Graph y sitemap.
 */
export const site = {
  name: "Gabriel Lloveras",
  role: "Fullstack Developer",
  title: "Gabriel Lloveras — Fullstack Developer",
  description:
    "Portfolio de Gabriel Lloveras, Fullstack Developer en Mendoza, Argentina. React, TypeScript y Next.js en frontend; Java, C# y Node.js en backend.",
  email: "gabriellloveras@gmail.com",
  linkedin: "https://www.linkedin.com/in/gabriel-lloveras-215b44238/",
  linkedinLabel: "linkedin.com/in/gabriel-lloveras-215b44238/",
  location: "Mendoza, Argentina",
  locationShort: "Mendoza, AR",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "",
} as const;

export const themeScript = `(function(){try{var s=localStorage.getItem("theme");var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t==="light"?"#e8eef7":"#070b12");}catch(e){}})();`;
