"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { completeCommand } from "@/lib/commands";
import { useI18n } from "@/components/locale";

export function CommandInput({
  onExecute,
}: {
  onExecute: (command: string) => void;
}) {
  const { m } = useI18n();
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const draft = useRef("");

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
    <form
      className="command-form"
      aria-label={m.terminalForm}
      onSubmit={(event) => {
        event.preventDefault();
        submit(value);
      }}
    >
      <div className="command-entry">
        <span className="prompt-mark" aria-hidden="true">
          $
        </span>
        <input
          aria-label={m.commandInput}
          className="command-input"
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
      </div>
      <button type="submit" className="sr-only">
        {m.run}
      </button>
    </form>
  );
}
