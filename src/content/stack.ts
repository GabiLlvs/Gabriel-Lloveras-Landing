export type StackGroup = {
  id: string;
  label: string;
  items: string[];
};

export const stack: StackGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Zustand",
      "TanStack Query",
      "React Hook Form",
      "i18n",
      "REST APIs",
      "Technical SEO",
    ],
  },
  {
    id: "ui",
    label: "UI / UX",
    items: ["Material UI", "HTML", "CSS", "Responsive Design", "UX/UI"],
  },
  {
    id: "backend",
    label: "Backend",
    items: ["Java", "C#", "Node.js", "Express"],
  },
  {
    id: "data",
    label: "Data",
    items: ["PostgreSQL", "SQL"],
  },
  {
    id: "tools",
    label: "Tools",
    items: ["Azure DevOps", "Jira"],
  },
];
