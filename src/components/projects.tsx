"use client";

import { projects } from "@/content/projects";
import { SectionFrame } from "@/components/section-frame";
import { useI18n } from "@/components/locale";

export function Projects() {
  const { m } = useI18n();

  return (
    <SectionFrame
      id="projects"
      command="projects"
      file="projects/"
      title={m.sections.projects}
    >
      <p className="cmd-line">
        <span className="prompt-mark" aria-hidden="true">
          $
        </span>
        ls projects/
      </p>

      {projects.length === 0 ? (
        <p className="empty">{m.projectsEmpty}</p>
      ) : (
        <div className="repo-list">
          {projects.map((project, index) => (
            <details
              key={project.slug}
              id={`project-${project.slug}`}
              className={
                project.placeholder ? "repo is-placeholder" : "repo"
              }
            >
              <summary>
                <span className="repo-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="repo-name">
                  <h3>{project.title}</h3>
                  {project.placeholder ? (
                    <span className="badge">{m.pending}</span>
                  ) : null}
                </span>
                <span className="repo-slug">{project.slug}</span>
              </summary>
              <div className="repo-body">
                <p className="prose">{project.summary}</p>

                {project.problem ? (
                  <div className="repo-block">
                    <h4>{m.problem}</h4>
                    <p className="prose">{project.problem}</p>
                  </div>
                ) : null}

                {project.contribution ? (
                  <div className="repo-block">
                    <h4>{m.contribution}</h4>
                    <p className="prose">{project.contribution}</p>
                  </div>
                ) : null}

                {project.highlights && project.highlights.length > 0 ? (
                  <div className="repo-block">
                    <h4>{m.features}</h4>
                    <ul className="repo-points">
                      {project.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {project.stack.length > 0 ? (
                  <ul className="tags" aria-label={`${m.stackOf} ${project.title}`}>
                    {project.stack.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}

                {project.images && project.images.length > 0 ? (
                  <ul className="shots">
                    {project.images.map((image) => (
                      <li key={image.src}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.src}
                          alt={image.alt}
                          width={image.width}
                          height={image.height}
                        />
                      </li>
                    ))}
                  </ul>
                ) : null}

                {project.links && project.links.length > 0 ? (
                  <ul className="repo-links">
                    {project.links.map((link) => (
                      <li key={link.href}>
                        <a href={link.href} target="_blank" rel="noreferrer">
                          {link.label}
                          <span className="sr-only">
                            {" "}
                            {m.newTab}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      )}
    </SectionFrame>
  );
}
