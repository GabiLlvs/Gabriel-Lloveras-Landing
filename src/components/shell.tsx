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
};

export function Shell({ children }: ShellProps) {
  const { locale, m } = useI18n();
  const [log, setLog] = useState<LogItem[]>([]);
  const [active, setActive] = useState("session");
  const seq = useRef(0);
  const lock = useRef(false);
  const explicitSelection = useRef(false);
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
    explicitSelection.current = true;
    pendingScroll.current = {
      destination,
      focus: Boolean(options?.focus),
    };
    if (result.active) setActive(result.active);

    let timer = 0;
    const release = () => {
      window.removeEventListener("scrollend", release);
      window.clearTimeout(timer);
      if (scrollGeneration.current !== generation || !lock.current) return;
      lock.current = false;
    };
    window.addEventListener("scrollend", release);
    timer = window.setTimeout(release, 3000);
  }, [locale]);

  useLayoutEffect(() => {
    const pending = pendingScroll.current;
    if (!pending) return;
    pendingScroll.current = null;

    const target = document.getElementById(pending.destination);
    if (!target) {
      lock.current = false;
      explicitSelection.current = false;
      return;
    }
    const targetStyle = getComputedStyle(target);
    const scrollPadding = Number.parseFloat(
      getComputedStyle(document.documentElement).scrollPaddingTop,
    );
    const scrollMargin = Number.parseFloat(targetStyle.scrollMarginTop);
    const alignedOffset =
      (Number.isFinite(scrollPadding) ? scrollPadding : 0) +
      (Number.isFinite(scrollMargin) ? scrollMargin : 0);
    const aligned = Math.abs(target.getBoundingClientRect().top - alignedOffset) <= 2;
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
      if (lock.current || explicitSelection.current) return;

      const header = document.querySelector("header");
      const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
      const line = headerBottom + 28;
      const items = SECTION_IDS.flatMap((id) => {
        const node = document.getElementById(id);
        if (!node) return [];
        const rect = node.getBoundingClientRect();
        return [{ id, top: rect.top }];
      });
      if (items.length === 0) return;

      let current = items[0].id;
      for (const item of items) {
        if (item.top <= line) current = item.id;
      }

      setActive((previous) => (previous === current ? previous : current));
    };

    const resumeTracking = (event: Event) => {
      if (event.type === "keydown") {
        const keyEvent = event as KeyboardEvent;
        if (
          !["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(
            keyEvent.key,
          )
        ) {
          return;
        }
        const target = keyEvent.target;
        if (
          target instanceof HTMLElement &&
          (target.isContentEditable ||
            target.closest("input, textarea, select, button, a, [contenteditable='true']"))
        ) {
          return;
        }
      }
      if (event.type === "pointerdown") {
        const pointer = event as PointerEvent;
        if (pointer.clientX < window.innerWidth - 16 && pointer.clientY < window.innerHeight - 16) {
          return;
        }
      }
      explicitSelection.current = false;
      lock.current = false;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("wheel", resumeTracking, { passive: true });
    window.addEventListener("touchstart", resumeTracking, { passive: true });
    window.addEventListener("pointerdown", resumeTracking);
    window.addEventListener("keydown", resumeTracking);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("wheel", resumeTracking);
      window.removeEventListener("touchstart", resumeTracking);
      window.removeEventListener("pointerdown", resumeTracking);
      window.removeEventListener("keydown", resumeTracking);
    };
  }, []);

  return (
    <>
      <a className="skip" href="#contenido">
        {m.skip}
      </a>
      <StatusBar onExecute={execute} />
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
