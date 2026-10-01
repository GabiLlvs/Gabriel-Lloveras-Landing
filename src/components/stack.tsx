import { stack } from "@/content/stack";
import { SectionFrame } from "@/components/section-frame";

export function Stack() {
  return (
    <SectionFrame
      id="stack"
      command="stack"
      file="stack.json"
      title="Tecnologías"
    >
      <p className="cmd-line">
        <span className="prompt-mark" aria-hidden="true">
          $
        </span>
        npm list --depth=0
      </p>
      <div className="stack-grid">
        {stack.map((group) => (
          <section key={group.id} className="stack-group" aria-labelledby={`stack-${group.id}`}>
            <h3 id={`stack-${group.id}`}>{group.label}</h3>
            <ul className="pkg">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </SectionFrame>
  );
}
