export type Section = {
  id: "session" | "about" | "experience" | "projects" | "stack" | "education" | "contact";
  command: string;
  file: string;
};

export const sections = [
  { id: "session", command: "whoami", file: "~" },
  { id: "about", command: "about", file: "about.md" },
  { id: "experience", command: "experience", file: "experience.log" },
  { id: "projects", command: "projects", file: "projects/" },
  { id: "stack", command: "stack", file: "stack.json" },
  { id: "education", command: "education", file: "education.md" },
  { id: "contact", command: "contact", file: "contact" },
] as const satisfies readonly Section[];

export type SectionId = (typeof sections)[number]["id"];
export type SectionCommand = (typeof sections)[number]["command"];
