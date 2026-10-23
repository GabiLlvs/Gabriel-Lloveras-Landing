"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { completeCommand } from "@/lib/commands";
import { PixelLoader } from "@/components/pixel-loader";
import type { ExecuteCommand } from "@/lib/execute-command";
import { useI18n } from "@/components/locale";

export function CommandInput({
  onExecute,
  busy = false,
}: {
  onExecute: ExecuteCommand;
  busy?: boolean;
}) {
  const { m } = useI18n();
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const draft = useRef("");

  function submit(command: string) {
    if (busy) return;
    const trimmed = command.trim();
    if (!trimmed) return;
    setHistory((current) => [...current, trimmed]);
    setCursor(-1);
    draft.current = "";
    setValue("");
    onExecute(trimmed, { fromConsole: true });
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
      if (busy) return;
      submit(event.currentTarget.value);
      return;
    }

    if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setValue("");
      setCursor(-1);
      onExecute("clear", { fromConsole: true });
    }
  }

  return (
    <form
      className="term-form"
      aria-label={m.terminalForm}
      aria-busy={busy}
      onSubmit={(event) => {
        event.preventDefault();
        submit(value);
      }}
    >
      <label htmlFor="terminal-command" className="sr-only">
        {m.commandInput}
      </label>
      <div className={busy ? "term-entry is-busy" : "term-entry"}>
        <span className="prompt-mark" aria-hidden="true">
          $
        </span>
        <span className="term-field">
          <input
            id="terminal-command"
            aria-label={m.commandInput}
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
            placeholder={m.commandPlaceholder}
            disabled={busy}
            readOnly={busy}
          />
          {busy ? <PixelLoader /> : null}
        </span>
      </div>
      <button type="submit" className="sr-only">
        {m.run}
      </button>
    </form>
  );
}
