"use client";

import { sections } from "@/content/navigation";

type CommandNavProps = {
  active: string;
  onSelect: (command: string) => void;
};

export function CommandNav({ active, onSelect }: CommandNavProps) {
  return (
    <nav className="command-nav" aria-label="Secciones">
      <p className="nav-kicker">session</p>
      <ul className="nav-list">
        {sections.map((section) => {
          const current = active === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="nav-link"
                aria-current={current ? "location" : undefined}
                onClick={(event) => {
                  if (
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey ||
                    event.button !== 0
                  ) {
                    return;
                  }
                  event.preventDefault();
                  onSelect(section.command);
                }}
              >
                <span className="nav-cmd">
                  <span className="prompt-mark" aria-hidden="true">
                    $
                  </span>
                  {section.command}
                </span>
                <span className="nav-label">{section.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
