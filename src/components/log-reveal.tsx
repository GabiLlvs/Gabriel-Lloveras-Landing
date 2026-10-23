"use client";

import { useCallback, useState } from "react";
import { useI18n } from "@/components/locale";
import { useTypewriter } from "@/hooks/use-typewriter";

type HelpEntry = {
  command: string;
  hint: string;
  run?: string;
};

function TypedLine({
  text,
  className,
  active,
  onComplete,
}: {
  text: string;
  className?: string;
  active: boolean;
  onComplete?: () => void;
}) {
  const { displayed, done } = useTypewriter(text, { active, onComplete });

  return (
    <p className={className}>
      {displayed}
      {active && !done ? <span className="type-caret" aria-hidden="true" /> : null}
    </p>
  );
}

function HelpEntryLine({
  entry,
  active,
  onExecute,
  onComplete,
}: {
  entry: HelpEntry;
  active: boolean;
  onExecute: (command: string) => void;
  onComplete?: () => void;
}) {
  const { displayed, done } = useTypewriter(entry.command, {
    active,
    msPerChar: 14,
    onComplete,
  });

  return (
    <>
      {done && entry.run ? (
        <button type="button" onClick={() => onExecute(entry.run!)}>
          {entry.command}
        </button>
      ) : (
        <span className="help-cmd help-cmd--typing">
          {displayed}
          {active && !done ? <span className="type-caret" aria-hidden="true" /> : null}
        </span>
      )}
      {done ? <span>{entry.hint}</span> : null}
    </>
  );
}

export function HelpReveal({
  onExecute,
}: {
  onExecute: (command: string) => void;
}) {
  const { m } = useI18n();
  const entries = m.help;
  const notePhase = entries.length + 1;
  const [phase, setPhase] = useState(0);

  const advance = useCallback(() => {
    setPhase((current) => current + 1);
  }, []);

  return (
    <div className="help help--reveal">
      {phase > 0 ? <p>{m.helpTitle}</p> : null}
      {phase === 0 ? (
        <TypedLine text={m.helpTitle} active onComplete={advance} />
      ) : null}

      <ul>
        {entries.map((entry, index) => {
          const entryPhase = index + 1;
          if (phase < entryPhase) return null;

          const complete = phase > entryPhase;
          const typing = phase === entryPhase;

          return (
            <li key={entry.command}>
              {complete ? (
                <>
                  {entry.run ? (
                    <button type="button" onClick={() => onExecute(entry.run!)}>
                      {entry.command}
                    </button>
                  ) : (
                    <span className="help-cmd">{entry.command}</span>
                  )}
                  <span>{entry.hint}</span>
                </>
              ) : typing ? (
                <HelpEntryLine
                  entry={entry}
                  active
                  onExecute={onExecute}
                  onComplete={advance}
                />
              ) : null}
            </li>
          );
        })}
      </ul>

      {phase >= notePhase ? (
        phase > notePhase ? (
          <p className="help-note">{m.helpNote}</p>
        ) : (
          <TypedLine
            text={m.helpNote}
            className="help-note"
            active
            onComplete={advance}
          />
        )
      ) : null}
    </div>
  );
}

export function TypedLogText({
  text,
  className,
}: {
  text: string;
  className: string;
}) {
  const { displayed, done } = useTypewriter(text, {
    active: true,
    msPerChar: 12,
  });

  return (
    <p className={className}>
      {displayed}
      {!done ? <span className="type-caret" aria-hidden="true" /> : null}
    </p>
  );
}
