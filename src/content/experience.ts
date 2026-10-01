export type Role = {
  org: string;
  role: string;
  period: string;
  summary: string;
  context?: string;
  stack: string[];
};

export const experience: Role[] = [
  {
    org: "Paroz Labs",
    role: "Frontend Developer & UX/UI Designer",
    period: "Diciembre 2024 — Agosto 2026",
    summary:
      "Sistemas de gestión y reservas con React, TypeScript y Next.js. Lógica de negocio, componentes reutilizables, formularios complejos con validación, dashboards, reporting, APIs REST e internacionalización.",
    context: "Scrum · Azure DevOps · Jira",
    stack: ["React", "TypeScript", "Next.js", "Zustand", "REST APIs", "i18n"],
  },
  {
    org: "Follow Hub",
    role: "Frontend Developer & UX/UI Designer",
    period: "Diciembre 2022 — Diciembre 2024",
    summary:
      "Interfaz de una plataforma de logística con React, JavaScript, HTML y CSS. Pantallas responsive, flujos de UX/UI e integración de librerías para requerimientos funcionales y visuales.",
    stack: ["React", "JavaScript", "HTML", "CSS"],
  },
];
