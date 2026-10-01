import { site } from "@/content/site";
import { LanguageSwitch } from "@/components/locale";
import { ThemeSlider } from "@/components/theme";

export function StatusBar() {
  return (
    <header className="status">
      <div className="status-inner">
        <p className="status-id">
          <span className="status-mark" aria-hidden="true" />
          gabriel@portfolio
        </p>
        <p className="status-path">~/session</p>
        <div className="status-end">
          <p className="status-loc">{site.locationShort}</p>
          <LanguageSwitch />
        </div>
      </div>
      <ThemeSlider />
    </header>
  );
}
