"use client";

import { profile } from "@/content/profile";
import { SectionFrame } from "@/components/section-frame";
import { useI18n } from "@/components/locale";

export function About() {
  const { locale, m } = useI18n();
  const copy = profile[locale];

  return (
    <SectionFrame id="about" command="about" file="about.md" title={m.sections.about}>
      {copy.about.map((paragraph) => (
        <p key={paragraph} className="prose">
          {paragraph}
        </p>
      ))}
      <ul className="facts">
        {copy.languages.map((language) => (
          <li key={language.name}>
            <span>{language.name}</span>
            {language.level}
          </li>
        ))}
      </ul>
    </SectionFrame>
  );
}
