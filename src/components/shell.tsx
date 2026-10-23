"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CommandNav } from "@/components/command-nav";
import { ConsoleDock } from "@/components/console-dock";
import { StatusBar } from "@/components/status-bar";
import { Terminal, type LogItem } from "@/components/terminal";
import { site } from "@/content/site";
import { useI18n } from "@/components/locale";
import { resolveCommand } from "@/lib/commands";
import type { ExecuteCommandOptions } from "@/lib/execute-command";
import { scrollSessionLogIfNeeded, scrollToTarget } from "@/lib/scroll-to-target";

type ShellProps = {
  children: ReactNode;
};

const SCROLL_DELAY_MS = 2000;
const CONSOLE_BUSY_SHORT_MS = 720;

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
  hash: string;
  active?: string;
};

export function Shell({ children }: ShellProps) {
  const { locale, m } = useI18n();
  const [log, setLog] = useState<LogItem[]>([]);
  const [active, setActive] = useState("session");
  const [consoleBusy, setConsoleBusy] = useState(false);
  const seq = useRef(0);
  const lock = useRef(false);
  const explicitSelection = useRef(false);
  const pendingScroll = useRef<PendingScroll | null>(null);
  const scrollDelayTimer = useRef(0);
  const consoleBusyTimer = useRef(0);
  const scrollGeneration = useRef(0);

  const stopConsoleBusy = useCallback(() => {
    window.clearTimeout(consoleBusyTimer.current);
    setConsoleBusy(false);
  }, []);

  const startConsoleBusy = useCallback(
    (mode: "scroll" | "short") => {
      window.clearTimeout(consoleBusyTimer.current);
      setConsoleBusy(true);
      if (mode === "short") {
        consoleBusyTimer.current = window.setTimeout(
          stopConsoleBusy,
          CONSOLE_BUSY_SHORT_MS,
        );
      }
    },
    [stopConsoleBusy],
  );

  const finishPendingScroll = useCallback(() => {
    const pending = pendingScroll.current;
    if (!pending) return;

    pendingScroll.current = null;
    window.history.replaceState(null, "", `#${pending.hash}`);

    scrollGeneration.current += 1;
    const generation = scrollGeneration.current;
    lock.current = true;
    explicitSelection.current = true;
    if (pending.active) setActive(pending.active);

    const scrolled = scrollToTarget({
      destination: pending.destination,
      focus: pending.focus,
    });
    if (!scrolled) {
      lock.current = false;
      explicitSelection.current = false;
      stopConsoleBusy();
      return;
    }

    stopConsoleBusy();

    let timer = 0;
    const release = () => {
      window.removeEventListener("scrollend", release);
      window.clearTimeout(timer);
      if (scrollGeneration.current !== generation || !lock.current) return;
      lock.current = false;
    };
    window.addEventListener("scrollend", release);
    timer = window.setTimeout(release, 3000);
  }, [stopConsoleBusy]);

  const schedulePendingScroll = useCallback(() => {
    window.clearTimeout(scrollDelayTimer.current);
    if (!pendingScroll.current) return;
    scrollDelayTimer.current = window.setTimeout(() => {
      finishPendingScroll();
    }, SCROLL_DELAY_MS);
  }, [finishPendingScroll]);

  const execute = useCallback((raw: string, options?: ExecuteCommandOptions) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const result = resolveCommand(trimmed, locale);
    if (result.clear) {
      window.clearTimeout(scrollDelayTimer.current);
      pendingScroll.current = null;
      if (options?.fromConsole) stopConsoleBusy();
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

    window.clearTimeout(scrollDelayTimer.current);
    pendingScroll.current = null;

    if (options?.fromConsole) {
      startConsoleBusy(result.scrollTo ? "scroll" : "short");
    }

    if (result.scrollTo) {
      const destination = result.scrollTo;
      const hash =
        result.active === "projects" && destination.startsWith("project-")
          ? "projects"
          : destination;
      pendingScroll.current = {
        destination,
        focus: Boolean(options?.focus),
        hash,
        active: result.active,
      };
      if (options?.fromConsole) {
        schedulePendingScroll();
      } else {
        finishPendingScroll();
      }
    }

    if (lines.length > 0 && !result.scrollTo && options?.fromConsole) {
      window.requestAnimationFrame(() => scrollSessionLogIfNeeded());
    }
  }, [finishPendingScroll, schedulePendingScroll, locale, startConsoleBusy, stopConsoleBusy]);

  useEffect(() => {
    return () => {
      window.clearTimeout(scrollDelayTimer.current);
      window.clearTimeout(consoleBusyTimer.current);
    };
  }, []);

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
        const target = pointer.target;
        if (
          target instanceof HTMLElement &&
          target.closest(".console-dock, input, textarea, select, button, a")
        ) {
          return;
        }
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
      <StatusBar />
      <div className="workspace">
        <CommandNav active={active} onSelect={select} />
        <main id="contenido" className="main" tabIndex={-1}>
          <ConsoleDock onExecute={execute} busy={consoleBusy} />
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
