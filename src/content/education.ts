import type { Locale } from "@/content/locale";

export type Study = {
  title: string;
  org: string;
  period: string;
};

export const education: Record<Locale, Study[]> = {
  es: [
    {
      title: "Tecnicatura en Desarrollo de Software",
      org: "ISTEA",
      period: "2023 — 2025",
    },
    {
      title: "Programador Full Stack",
      org: "Bootcamp Egg",
      period: "2021 — 2022",
    },
    {
      title: "Bachiller en Informática",
      org: "Escuela de Comercio Martín Zapata",
      period: "2013 — 2017",
    },
  ],
  en: [
    {
      title: "Technical Degree in Software Development",
      org: "ISTEA",
      period: "2023 — 2025",
    },
    {
      title: "Full Stack Developer Program",
      org: "Bootcamp Egg",
      period: "2021 — 2022",
    },
    {
      title: "High School Diploma in Computing",
      org: "Escuela de Comercio Martín Zapata",
      period: "2013 — 2017",
    },
  ],
};
