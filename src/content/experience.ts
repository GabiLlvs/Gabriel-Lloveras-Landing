import type { Locale } from "@/content/locale";

export type Role = {
  org: string;
  role: string;
  period: string;
  summary: string;
  context?: string;
  projects?: { name: string; summary: string }[];
  stack: string[];
};

export const experience: Record<Locale, Role[]> = {
  es: [
    {
      org: "Follow Hub",
      role: "Fullstack Developer",
      period: "Agosto 2026 — Actualidad",
      summary:
        "Desarrollo fullstack con React y React Native en frontend, y Java con Spring Boot en backend.",
      stack: ["React", "React Native", "Java", "Spring Boot"],
    },
    {
      org: "Paroz Labs",
      role: "Frontend Developer & UX/UI Designer",
      period: "Diciembre 2024 — Agosto 2026",
      summary:
        "Diseño UX/UI y desarrollo frontend de soluciones web y mobile: flujos y prototipos en Figma, implementación de vistas, formularios, dashboards, reporting e integración con APIs REST.",
      context: "Scrum · Azure DevOps · Jira",
      projects: [
        {
          name: "ANP — Catálogo y Turnero",
          summary:
            "Diseñé y desarrollé las vistas del catálogo y turnero, primero esquematizándolas en Figma y luego implementándolas.",
        },
        {
          name: "SGP",
          summary:
            "En la evolución de la app web a mobile, definí flujos y prototipos en Figma e implementé vistas con React Native.",
        },
        {
          name: "Farmacias",
          summary:
            "Aporté asesoría UX/UI, implementé vistas, mejoré prototipos y propuse ideas para dar mayor atractivo visual a los proyectos.",
        },
        {
          name: "Boletín Oficial (BOE)",
          summary:
            "Participé en la migración del frontend del Boletín Oficial de la provincia a Next.js, modernizando la interfaz y conservando los flujos existentes.",
        },
      ],
      stack: [
        "React",
        "React Native",
        "TypeScript",
        "Next.js",
        "Figma",
        "Zustand",
        "REST APIs",
        "i18n",
      ],
    },
    {
      org: "Follow Hub",
      role: "Frontend Developer & UX/UI Designer",
      period: "Diciembre 2022 — Diciembre 2024",
      summary:
        "Interfaz de una plataforma de logística con React, JavaScript, HTML y CSS. Pantallas responsive, flujos de UX/UI e integración de librerías para requerimientos funcionales y visuales.",
      stack: ["React", "JavaScript", "HTML", "CSS"],
    },
  ],
  en: [
    {
      org: "Follow Hub",
      role: "Fullstack Developer",
      period: "August 2026 — Present",
      summary:
        "Fullstack development with React and React Native on the frontend, and Java with Spring Boot on the backend.",
      stack: ["React", "React Native", "Java", "Spring Boot"],
    },
    {
      org: "Paroz Labs",
      role: "Frontend Developer & UX/UI Designer",
      period: "December 2024 — August 2026",
      summary:
        "UX/UI design and frontend development for web and mobile products: Figma flows and prototypes, view implementation, forms, dashboards, reporting, and REST API integrations.",
      context: "Scrum · Azure DevOps · Jira",
      projects: [
        {
          name: "ANP — Catalog and Appointment System",
          summary:
            "Designed and built catalog and appointment-system views, sketching them in Figma before implementing them.",
        },
        {
          name: "SGP",
          summary:
            "As the web app evolved into a mobile app, planned flows and prototypes in Figma and implemented views with React Native.",
        },
        {
          name: "Pharmacies",
          summary:
            "Provided UX/UI guidance, implemented views, refined prototypes, and proposed visual improvements.",
        },
        {
          name: "Official Gazette (BOE)",
          summary:
            "Contributed to migrating the provincial Official Gazette frontend to Next.js, modernizing its interface while preserving existing user flows.",
        },
      ],
      stack: [
        "React",
        "React Native",
        "TypeScript",
        "Next.js",
        "Figma",
        "Zustand",
        "REST APIs",
        "i18n",
      ],
    },
    {
      org: "Follow Hub",
      role: "Frontend Developer & UX/UI Designer",
      period: "December 2022 — December 2024",
      summary:
        "Interface for a logistics platform with React, JavaScript, HTML, and CSS. Responsive screens, UX/UI flows, and library integration for functional and visual requirements.",
      stack: ["React", "JavaScript", "HTML", "CSS"],
    },
  ],
};
