"use client";

import { CommandInput } from "@/components/command-input";
import type { ExecuteCommand } from "@/lib/execute-command";
import { useI18n } from "@/components/locale";

export function ConsoleDock({
  onExecute,
  busy = false,
}: {
  onExecute: ExecuteCommand;
  busy?: boolean;
}) {
  const { m } = useI18n();

  return (
    <div className="console-dock">
      <div className="console-dock-inner">
        <CommandInput onExecute={onExecute} busy={busy} />
        <p className="console-dock-hint term-hint">
          <span className="hint-group">
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            {m.history}
          </span>
          <span className="hint-group">
            <kbd>tab</kbd>
            {m.complete}
          </span>
          <span className="hint-group">
            <kbd>help</kbd>
            {m.commands}
          </span>
        </p>
      </div>
    </div>
  );
}
