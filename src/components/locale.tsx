"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { messages } from "@/content/messages";
import type { Locale } from "@/content/locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initial,
  children,
}: {
  initial: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState(initial);

  function setLocale(next: Locale) {
    document.cookie = `locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    document.documentElement.lang = next;
    setLocaleState(next);
  }

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("LocaleProvider is missing");
  }
  return { ...context, m: messages[context.locale] };
}

export function LanguageSwitch() {
  const { locale, setLocale, m } = useI18n();

  return (
    <div className="lang-switch" role="group" aria-label={m.language}>
      <button
        type="button"
        aria-pressed={locale === "es"}
        aria-label="Español"
        onClick={() => setLocale("es")}
      >
        ES
      </button>
      <button
        type="button"
        aria-pressed={locale === "en"}
        aria-label="English"
        onClick={() => setLocale("en")}
      >
        EN
      </button>
    </div>
  );
}
