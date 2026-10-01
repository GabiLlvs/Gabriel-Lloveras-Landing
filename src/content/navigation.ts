export type Section = {
  id: string;
  command: string;
  label: string;
  file: string;
};

export const sections = [
  { id: "session", command: "whoami", label: "Inicio", file: "~" },
  { id: "about", command: "about", label: "Perfil", file: "about.md" },
  {
    id: "experience",
    command: "experience",
    label: "Experiencia",
    file: "experience.log",
  },
  { id: "projects", command: "projects", label: "Proyectos", file: "projects/" },
  { id: "stack", command: "stack", label: "Tecnologías", file: "stack.json" },
  {
    id: "education",
    command: "education",
    label: "Formación",
    file: "education.md",
  },
  { id: "contact", command: "contact", label: "Contacto", file: "contact" },
] as const satisfies readonly Section[];

export type SectionId = (typeof sections)[number]["id"];
export type SectionCommand = (typeof sections)[number]["command"];
