import { education } from "@/content/education";
import { SectionFrame } from "@/components/section-frame";

export function Education() {
  return (
    <SectionFrame
      id="education"
      command="education"
      file="education.md"
      title="Formación"
    >
      <div className="log">
        {education.map((study) => (
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
