"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { helpEntries, completeCommand } from "@/lib/commands";
import { profile } from "@/content/profile";
import { site } from "@/content/site";

export type LogItem =
  | { id: string; kind: "input"; text: string }
  | { id: string; kind: "text"; text: string }
  | { id: string; kind: "error"; text: string }
  | { id: string; kind: "help" };

type TerminalProps = {
  log: LogItem[];
  onExecute: (command: string, options?: { focus?: boolean }) => void;
};

function Portrait() {
  return (
    <div className="portrait">
      <img src="/portrait.jpg" alt={site.name} width={960} height={1200} />
    </div>
  );
}

export function Terminal({ log, onExecute }: TerminalProps) {
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const draft = useRef("");
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const node = logRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [log]);

  function submit(command: string) {
    const trimmed = command.trim();
    if (!trimmed) return;
    setHistory((current) => [...current, trimmed]);
    setCursor(-1);
    draft.current = "";
    setValue("");
    onExecute(trimmed);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length === 0) return;
      if (cursor === -1) draft.current = value;
      const next = cursor === -1 ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next] ?? "");
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (cursor === -1) return;
      if (cursor >= history.length - 1) {
        setCursor(-1);
        setValue(draft.current);
        return;
      }
      const next = cursor + 1;
      setCursor(next);
      setValue(history[next] ?? "");
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const next = completeCommand(value);
      if (next) setValue(next);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      submit(event.currentTarget.value);
      return;
    }

    if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setValue("");
      setCursor(-1);
      onExecute("clear");
    }
  }

  return (
    <article className="term" id="session" aria-labelledby="session-title">
      <div className="term-chrome">
        <span>gabriel@portfolio:~</span>
        <span className="term-chrome-meta">session</span>
      </div>

      <div className="term-body">
        <p className="hero-prompt">
          <span className="hero-user">gabriel@portfolio</span>
          <span className="hero-path">:~</span>
          <span className="prompt-mark" aria-hidden="true">
            $
          </span>
          <span className="hero-cmd">whoami</span>
        </p>

        <div className="hero-output">
          <div className="hero-layout">
            <div className="hero-copy">
              <h1 id="session-title" tabIndex={-1}>
                {site.name}
              </h1>
              <p className="hero-role">{site.role}</p>
              {profile.lead.map((line) => (
                <p key={line} className="hero-lead">
                  {line}
                </p>
              ))}
              <p className="hero-loc">{site.location}</p>
              <div className="hero-actions">
                <a
                  className="chip"
                  href="#projects"
                  onClick={(event) => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    onExecute("projects");
                  }}
                >
                  <span className="prompt-mark" aria-hidden="true">
                    $
                  </span>
                  projects
                </a>
                <a
                  className="chip"
                  href="#contact"
                  onClick={(event) => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    onExecute("contact");
                  }}
                >
                  <span className="prompt-mark" aria-hidden="true">
                    $
                  </span>
                  contact
                </a>
              </div>
            </div>
            <Portrait />
          </div>
        </div>

        <div
          ref={logRef}
          className="term-log"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-label="Salida de la terminal"
          data-empty={log.length === 0}
        >
          {log.map((line) => {
            if (line.kind === "help") {
              return (
                <div key={line.id} className="help">
                  <p>Comandos</p>
                  <ul>
                    {helpEntries.map((entry) => (
                      <li key={entry.command}>
                        {entry.run ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (entry.run) onExecute(entry.run);
                            }}
                          >
                            {entry.command}
                          </button>
                        ) : (
                          <span className="help-cmd">{entry.command}</span>
                        )}
                        <span>{entry.hint}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="help-note">
                    Las mismas secciones están en la navegación, sin usar el teclado.
                  </p>
                </div>
              );
            }

            if (line.kind === "input") {
              return (
                <p key={line.id} className="log-in">
                  <span className="prompt-mark" aria-hidden="true">
                    $
                  </span>
                  {line.text}
                </p>
              );
            }

            return (
              <p key={line.id} className={line.kind === "error" ? "log-error" : "log-text"}>
                {line.text}
              </p>
            );
          })}
        </div>

        <form
          className="term-form"
          aria-label="Terminal de comandos"
          onSubmit={(event) => {
            event.preventDefault();
            submit(value);
          }}
        >
          <label htmlFor="terminal-command" className="sr-only">
            Escribir un comando
          </label>
          <div className="term-entry">
            <span className="prompt-mark" aria-hidden="true">
              $
            </span>
            <span className="term-field">
              <input
                ref={inputRef}
                id="terminal-command"
                className="term-input"
                value={value}
                onChange={(event) => {
                  setValue(event.target.value);
                  setCursor(-1);
                }}
                onKeyDown={onKeyDown}
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="go"
              />
              <span
                className={value ? "idle-caret is-off" : "idle-caret"}
                aria-hidden="true"
              />
            </span>
          </div>
          <button type="submit" className="sr-only">
            Ejecutar comando
          </button>
        </form>
        <p className="term-hint">
          <span className="hint-group">
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            historial
          </span>
          <span className="hint-group">
            <kbd>tab</kbd>
            completar
          </span>
          <span className="hint-group">
            <kbd>help</kbd>
            comandos
          </span>
        </p>
      </div>
    </article>
  );
}
