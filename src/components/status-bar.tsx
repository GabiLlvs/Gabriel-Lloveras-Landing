import { site } from "@/content/site";
import { LanguageSwitch } from "@/components/locale";
import { ThemeToggle } from "@/components/theme";
import { CommandInput } from "@/components/command-input";

export function StatusBar({
  onExecute,
}: {
  onExecute: (command: string) => void;
}) {
  return (
    <header className="status">
      <div className="status-inner">
        <p className="status-id">
          <span className="status-mark" aria-hidden="true" />
          gabriel@portfolio
        </p>
        <p className="status-path">~/session</p>
        <CommandInput onExecute={onExecute} />
        <div className="status-end">
          <p className="status-loc">{site.locationShort}</p>
          <ThemeToggle />
          <LanguageSwitch />
        </div>
      </div>
    </header>
  );
}
