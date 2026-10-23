"use client";

import { useEffect, useRef } from "react";
import { HelpReveal, TypedLogText } from "@/components/log-reveal";
import { useI18n } from "@/components/locale";
import type { ExecuteCommand } from "@/lib/execute-command";
import { profile } from "@/content/profile";
import { site } from "@/content/site";

export type LogItem =
  | { id: string; kind: "input"; text: string }
  | { id: string; kind: "text"; text: string }
  | { id: string; kind: "error"; text: string }
  | { id: string; kind: "help" };

type TerminalProps = {
  log: LogItem[];
  onExecute: ExecuteCommand;
};

function Portrait() {
  return (
    <div className="portrait">
      <img src="/portrait.jpg" alt={site.name} width={960} height={1200} />
    </div>
  );
}

export function Terminal({ log, onExecute }: TerminalProps) {
  const { locale, m } = useI18n();
  const copy = profile[locale];
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = logRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;

    const observer = new ResizeObserver(() => {
      node.scrollTop = node.scrollHeight;
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [log]);

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
              {copy.lead.map((line) => (
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
          aria-label={m.terminalOutput}
          data-empty={log.length === 0}
        >
          {log.map((line) => {
            if (line.kind === "help") {
              return <HelpReveal key={line.id} onExecute={onExecute} />;
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
              <TypedLogText
                key={line.id}
                text={line.text}
                className={line.kind === "error" ? "log-error" : "log-text"}
              />
            );
          })}
        </div>
      </div>
    </article>
  );
}
