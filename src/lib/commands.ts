import type { Locale } from "@/content/locale";
import { messages } from "@/content/messages";
import { sections } from "@/content/navigation";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export type CommandLine =
  | { kind: "text"; text: string }
  | { kind: "error"; text: string }
  | { kind: "help" };

export type CommandResult = {
  clear?: boolean;
  scrollTo?: string;
  active?: string;
  openDetails?: boolean;
  lines: CommandLine[];
};

const aliases: Record<string, string> = {
  ayuda: "help",
  perfil: "about",
  experiencia: "experience",
  proyectos: "projects",
  formacion: "education",
  formación: "education",
  contacto: "contact",
  tecnologias: "stack",
  tecnologías: "stack",
  limpiar: "clear",
  inicio: "whoami",
};

const canonical = [
  "help",
  "whoami",
  "about",
  "experience",
  "projects",
  "stack",
  "education",
  "contact",
  "clear",
  "ls",
  "open",
  "cd",
] as const;

function notFound(token: string, locale: Locale): CommandResult {
  const copy = messages[locale];
  return {
    lines: [
      { kind: "error", text: `${copy.notFound} ${token}` },
      { kind: "text", text: copy.helpHint },
    ],
  };
}

function row(key: string, value: string): CommandLine {
  return { kind: "text", text: `${key.padEnd(10, " ")}→ ${value}` };
}

function projectLines(locale: Locale): CommandLine[] {
  if (projects.length === 0) {
    return [
      { kind: "text", text: "projects/" },
      { kind: "text", text: messages[locale].projectsEmptyCmd },
    ];
  }

  return projects.map((project, index) => ({
    kind: "text",
    text: `${String(index + 1).padStart(2, "0")}  ${project.slug}`,
  }));
}

function commonPrefix(values: string[]): string {
  if (values.length === 0) return "";
  let prefix = values[0] ?? "";
  for (const value of values.slice(1)) {
    while (prefix && !value.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
    }
  }
  return prefix;
}

export function completeCommand(value: string): string | null {
  const trimmed = value.trimStart();
  if (!trimmed) return null;

  const parts = trimmed.split(/\s+/);
  const head = parts[0]?.toLowerCase() ?? "";

  if (parts.length > 1 && (head === "open" || head === "cd")) {
    const partial = parts.slice(1).join(" ").toLowerCase();
    const pool =
      head === "open"
        ? projects.map((project) => project.slug)
        : sections.map((section) => section.command);
    const matches = pool.filter((item) => item.startsWith(partial));
    if (matches.length === 1) return `${head} ${matches[0]}`;
    const prefix = commonPrefix(matches);
    if (prefix.length > partial.length) return `${head} ${prefix}`;
    return null;
  }

  if (trimmed.includes(" ")) return null;

  const matches = canonical.filter((command) => command.startsWith(head));
  if (matches.length === 1) return matches[0];
  const prefix = commonPrefix(matches);
  if (prefix.length > head.length) return prefix;
  return null;
}

export function resolveCommand(raw: string, locale: Locale): CommandResult {
  const copy = messages[locale];
  const trimmed = raw.trim().replace(/\s+/g, " ");
  const withoutCd = trimmed.replace(/^cd\s+/i, "");
  const [head, ...args] = withoutCd.split(" ");

  if (!head) return notFound(trimmed, locale);

  const command = aliases[head.toLowerCase()] ?? head.toLowerCase();
  const arg = args.join(" ");

  switch (command) {
    case "help":
      return { lines: [{ kind: "help" }] };
    case "clear":
      return { clear: true, lines: [] };
    case "ls":
      return {
        lines: sections.map((section) => ({
          kind: "text",
          text: section.command === "whoami" ? "whoami" : section.file,
        })),
      };
    case "whoami":
      return {
        active: "session",
        scrollTo: "session",
        lines: [
          { kind: "text", text: site.name },
          { kind: "text", text: site.role },
          { kind: "text", text: site.location },
        ],
      };
    case "about":
    case "experience":
    case "stack":
    case "education": {
      const section = sections.find((item) => item.command === command);
      return {
        active: section?.id,
        scrollTo: section?.id,
        lines: [{ kind: "text", text: `→ ${section?.file ?? command}` }],
      };
    }
    case "projects":
      return {
        active: "projects",
        scrollTo: "projects",
        lines: projectLines(locale),
      };
    case "contact":
      return {
        active: "contact",
        scrollTo: "contact",
        lines: [
          row("email", site.email),
          row("linkedin", site.linkedinLabel),
          row("location", site.location),
        ],
      };
    case "open": {
      if (!arg) {
        return { lines: [{ kind: "error", text: "usage: open <slug>" }] };
      }
      const project = projects.find(
        (item) => item.slug.toLowerCase() === arg.toLowerCase(),
      );
      if (!project) {
        const available = projects.map((item) => item.slug).join(", ");
        return {
          lines: [
            { kind: "error", text: `${copy.noProject} ${arg}` },
            {
              kind: "text",
              text: available ? `${copy.available} ${available}` : copy.projectsEmptyLong,
            },
          ],
        };
      }
      return {
        active: "projects",
        scrollTo: `project-${project.slug}`,
        openDetails: true,
        lines: [{ kind: "text", text: `→ projects/${project.slug}` }],
      };
    }
    default:
      return notFound(head, locale);
  }
}
