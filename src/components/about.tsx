import { profile } from "@/content/profile";
import { SectionFrame } from "@/components/section-frame";

export function About() {
  return (
    <SectionFrame id="about" command="about" file="about.md" title="Perfil">
      {profile.about.map((paragraph) => (
        <p key={paragraph} className="prose">
          {paragraph}
        </p>
      ))}
      <ul className="facts">
        {profile.languages.map((language) => (
          <li key={language.name}>
            <span>{language.name}</span>
            {language.level}
          </li>
        ))}
      </ul>
    </SectionFrame>
  );
}
