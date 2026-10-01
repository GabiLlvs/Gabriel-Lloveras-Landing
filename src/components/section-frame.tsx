import type { ReactNode } from "react";

type SectionFrameProps = {
  id: string;
  command: string;
  file: string;
  title: string;
  children: ReactNode;
};

export function SectionFrame({
  id,
  command,
  file,
  title,
  children,
}: SectionFrameProps) {
  return (
    <section className="panel" id={id} aria-labelledby={`${id}-title`}>
      <div className="panel-head">
        <div className="panel-heading">
          <p className="cmd-line">
            <span className="prompt-mark" aria-hidden="true">
              $
            </span>
            {command}
          </p>
          <h2 id={`${id}-title`} tabIndex={-1}>
            {title}
          </h2>
        </div>
        <p className="panel-file">{file}</p>
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}
