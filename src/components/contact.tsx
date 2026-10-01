"use client";

import { site } from "@/content/site";
import { SectionFrame } from "@/components/section-frame";
import { useI18n } from "@/components/locale";

export function Contact() {
  const { m } = useI18n();

  return (
    <SectionFrame id="contact" command="contact" file="contact" title={m.sections.contact}>
      <p className="prose contact-lead">{m.contactLead}</p>
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
              <span className="sr-only"> {m.newTab}</span>
            </a>
          </dd>
        </div>
        <div className="contact-row">
          <dt>{m.location}</dt>
          <dd>
            <span className="contact-arrow" aria-hidden="true">
              →
            </span>
            <span>{site.location}</span>
          </dd>
        </div>
      </dl>
      <a className="cta" href={`mailto:${site.email}`}>
        {m.writeEmail}
      </a>
    </SectionFrame>
  );
}
