"use client";

import { education } from "@/content/education";
import { SectionFrame } from "@/components/section-frame";
import { useI18n } from "@/components/locale";

export function Education() {
  const { locale, m } = useI18n();

  return (
    <SectionFrame
      id="education"
      command="education"
      file="education.md"
      title={m.sections.education}
    >
      <div className="log">
        {education[locale].map((study) => (
          <article key={study.title} className="job">
            <p className="job-period">{study.period}</p>
            <h3>{study.title}</h3>
            <p className="job-role">{study.org}</p>
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}
