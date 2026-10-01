"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CommandNav } from "@/components/command-nav";
import { StatusBar } from "@/components/status-bar";
import { Terminal, type LogItem } from "@/components/terminal";
import { site } from "@/content/site";
import { useI18n } from "@/components/locale";
import { resolveCommand } from "@/lib/commands";

type ShellProps = {
  children: ReactNode;
};

export function Shell({ children }: ShellProps) {
  const { locale, m } = useI18n();
  const [log, setLog] = useState<LogItem[]>([]);
  const [active, setActive] = useState("session");
  const seq = useRef(0);
  const lock = useRef(false);

  const execute = useCallback((raw: string, options?: { focus?: boolean }) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const result = resolveCommand(trimmed, locale);
    if (result.clear) {
      setLog([]);
      return;
    }

    const id = () => {
      seq.current += 1;
      return `log-${seq.current}`;
    };

    const input: LogItem = { id: id(), kind: "input", text: trimmed };
    const lines: LogItem[] = result.lines.map((line) =>
      line.kind === "help"
        ? { id: id(), kind: "help" }
        : { id: id(), kind: line.kind, text: line.text },
    );
    setLog((current) => [...current, input, ...lines].slice(-80));

    if (!result.scrollTo) return;

    lock.current = true;
    if (result.active) setActive(result.active);

    const target = document.getElementById(result.scrollTo);
    if (result.openDetails && target instanceof HTMLDetailsElement) {
      target.open = true;
    }
    target?.scrollIntoView({ block: "start" });

    if (options?.focus && target) {
      const heading = target.querySelector("h1, h2, h3");
      if (heading instanceof HTMLElement) {
        heading.focus({ preventScroll: true });
      }
    }

    const hash = result.active === "projects" && result.scrollTo.startsWith("project-")
      ? "projects"
      : result.scrollTo;
    window.history.replaceState(null, "", `#${hash}`);

    window.setTimeout(() => {
      lock.current = false;
    }, 900);
  }, [locale]);

  const select = useCallback(
    (command: string) => {
      execute(command, { focus: true });
    },
    [execute],
  );

  useEffect(() => {
    const ids = [
      "session",
      "about",
      "experience",
      "projects",
      "stack",
      "education",
      "contact",
    ];

    const update = () => {
      if (lock.current) return;
      const sticky = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--sticky-offset"),
      );
      const line = (Number.isFinite(sticky) ? sticky : 64) + 32;
      let current = "session";
      for (const id of ids) {
        const node = document.getElementById(id);
        if (!node) continue;
        if (node.getBoundingClientRect().top <= line) current = id;
      }
      setActive((previous) => (previous === current ? previous : current));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      <a className="skip" href="#contenido">
        {m.skip}
      </a>
      <StatusBar />
      <div className="workspace">
        <CommandNav active={active} onSelect={select} />
        <main id="contenido" className="main" tabIndex={-1}>
          <Terminal log={log} onExecute={execute} />
          {children}
          <footer className="colophon">
            <p className="cmd-line">
              <span className="prompt-mark" aria-hidden="true">
                $
              </span>
              {site.name} · {site.role} · Mendoza
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
