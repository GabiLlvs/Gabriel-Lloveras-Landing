"use client";

import { projects } from "@/content/projects";
import { SectionFrame } from "@/components/section-frame";
import { useI18n } from "@/components/locale";

export function Projects() {
  const { locale, m } = useI18n();

  return (
    <SectionFrame
      id="projects"
      command="projects"
      file="projects/"
      title={m.sections.projects}
    >
      {projects.length === 0 ? (
        <p className="empty">{m.projectsEmpty}</p>
      ) : (
        <div className="project-prose">
          {projects.map((project) => (
            <article
              key={project.slug}
              id={`project-${project.slug}`}
              className="project-entry"
            >
              <h3>{project.title}</h3>
              <p className="prose">
                {project.summary[locale]}{" "}
                {project.links.map((link, linkIndex) => (
                  <span key={link.href}>
                    {linkIndex > 0 ? " · " : ""}
                    <a href={link.href} target="_blank" rel="noreferrer">
                      {link.label[locale]}
                      <span className="sr-only"> {m.newTab}</span>
                    </a>
                  </span>
                ))}
              </p>
            </article>
          ))}
        </div>
      )}
    </SectionFrame>
  );
}
