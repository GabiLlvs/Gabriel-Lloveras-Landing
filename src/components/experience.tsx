"use client";

import { experience } from "@/content/experience";
import { SectionFrame } from "@/components/section-frame";
import { useI18n } from "@/components/locale";

export function Experience() {
  const { locale, m } = useI18n();

  return (
    <SectionFrame
      id="experience"
      command="experience"
      file="experience.log"
      title={m.sections.experience}
    >
      <div className="log">
        {experience[locale].map((job) => (
          <article key={job.org} className="job">
            <p className="job-period">{job.period}</p>
            <h3>{job.org}</h3>
            <p className="job-role">{job.role}</p>
            <ul className="tags" aria-label={`${m.techAt} ${job.org}`}>
              {job.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="prose">{job.summary}</p>
            {job.context ? <p className="job-context">{job.context}</p> : null}
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}
