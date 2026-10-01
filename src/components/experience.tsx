import { experience } from "@/content/experience";
import { SectionFrame } from "@/components/section-frame";

export function Experience() {
  return (
    <SectionFrame
      id="experience"
      command="experience"
      file="experience.log"
      title="Experiencia"
    >
      <div className="log">
        {experience.map((job) => (
          <article key={job.org} className="job">
            <p className="job-period">{job.period}</p>
            <h3>{job.org}</h3>
            <p className="job-role">{job.role}</p>
            <ul className="tags" aria-label={`Tecnologías en ${job.org}`}>
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
