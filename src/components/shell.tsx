"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { CommandNav } from "@/components/command-nav";
import { StatusBar } from "@/components/status-bar";
import { Terminal, type LogItem } from "@/components/terminal";
import { site } from "@/content/site";
import { useI18n } from "@/components/locale";
import { resolveCommand } from "@/lib/commands";

type ShellProps = {
  children: ReactNode;
};

const SECTION_IDS = [
  "session",
  "about",
  "experience",
  "projects",
  "stack",
  "education",
  "contact",
] as const;

type PendingScroll = {
  destination: string;
  focus: boolean;
  openDetails: boolean;
};

export function Shell({ children }: ShellProps) {
  const { locale, m } = useI18n();
  const [log, setLog] = useState<LogItem[]>([]);
  const [active, setActive] = useState("session");
  const seq = useRef(0);
  const lock = useRef(false);
  const pendingScroll = useRef<PendingScroll | null>(null);
  const scrollGeneration = useRef(0);

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

    const destination = result.scrollTo;
    const hash = result.active === "projects" && destination.startsWith("project-")
      ? "projects"
      : destination;
    window.history.replaceState(null, "", `#${hash}`);

    scrollGeneration.current += 1;
    const generation = scrollGeneration.current;
    lock.current = true;
    pendingScroll.current = {
      destination,
      focus: Boolean(options?.focus),
      openDetails: Boolean(result.openDetails),
    };
    if (result.active) setActive(result.active);

    let timer = 0;
    const release = () => {
      window.removeEventListener("scrollend", release);
      window.clearTimeout(timer);
      if (scrollGeneration.current !== generation || !lock.current) return;
      lock.current = false;
      window.dispatchEvent(new Event("scroll"));
    };
    window.addEventListener("scrollend", release);
    timer = window.setTimeout(release, 3000);
  }, [locale]);

  useLayoutEffect(() => {
    const pending = pendingScroll.current;
    if (!pending) return;
    pendingScroll.current = null;

    const target = document.getElementById(pending.destination);
    if (!target) return;
    if (pending.openDetails && target instanceof HTMLDetailsElement) {
      target.open = true;
    }
    const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop);
    const aligned =
      Number.isFinite(margin) && Math.abs(target.getBoundingClientRect().top - margin) <= 2;
    target.scrollIntoView({ block: "start" });
    if (aligned) window.dispatchEvent(new Event("scrollend"));
    if (!pending.focus) return;
    const heading = target.querySelector("h1, h2, h3");
    if (heading instanceof HTMLElement) {
      heading.focus({ preventScroll: true });
    }
  }, [log]);

  const select = useCallback(
    (command: string) => {
      execute(command, { focus: true });
    },
    [execute],
  );

  useEffect(() => {
    const update = () => {
      if (lock.current) return;

      const header = document.querySelector("header");
      const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
      const viewBottom = window.innerHeight;
      const line = headerBottom + 28;
      const items = SECTION_IDS.flatMap((id) => {
        const node = document.getElementById(id);
        if (!node) return [];
        const rect = node.getBoundingClientRect();
        const visible = Math.max(
          0,
          Math.min(rect.bottom, viewBottom) - Math.max(rect.top, headerBottom),
        );
        return [{ id, top: rect.top, visible }];
      });
      if (items.length === 0) return;

      const remain = document.documentElement.scrollHeight - window.scrollY - viewBottom;
      const last = items[items.length - 1];
      if (last && remain <= 72) {
        setActive((previous) => (previous === last.id ? previous : last.id));
        return;
      }

      let current = items[0].id;
      for (const item of items) {
        if (item.top <= line) current = item.id;
      }

      if (
        last &&
        last.id !== current &&
        last.top > headerBottom &&
        last.top < viewBottom * 0.62 &&
        last.visible > (items.find((item) => item.id === current)?.visible ?? 0)
      ) {
        current = last.id;
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
