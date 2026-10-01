import { site } from "@/content/site";
import { SectionFrame } from "@/components/section-frame";

export function Contact() {
  return (
    <SectionFrame id="contact" command="contact" file="contact" title="Contacto">
      <p className="prose contact-lead">
        Si estás armando un equipo o querés hablar de un proyecto, escribime.
      </p>
      <dl className="contact-list">
        <div className="contact-row">
          <dt>email</dt>
          <dd>
            <span className="contact-arrow" aria-hidden="true">
              →
            </span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </dd>
        </div>
        <div className="contact-row">
          <dt>linkedin</dt>
          <dd>
            <span className="contact-arrow" aria-hidden="true">
              →
            </span>
            <a href={site.linkedin} target="_blank" rel="noreferrer">
              {site.linkedinLabel}
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </dd>
        </div>
        <div className="contact-row">
          <dt>ubicación</dt>
          <dd>
            <span className="contact-arrow" aria-hidden="true">
              →
            </span>
            <span>{site.location}</span>
          </dd>
        </div>
      </dl>
      <a className="cta" href={`mailto:${site.email}`}>
        Escribir un email
      </a>
    </SectionFrame>
  );
}
