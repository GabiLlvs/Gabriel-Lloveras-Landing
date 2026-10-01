"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";

const THEME_KEY = "theme";
const COLORS = { dark: "#070b12", light: "#e8eef7" } as const;

type Theme = keyof typeof COLORS;

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

function applyTheme(theme: Theme, persist: boolean) {
  document.documentElement.dataset.theme = theme;
  if (persist) localStorage.setItem(THEME_KEY, theme);
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute("content", COLORS[theme]);
  });
  emit();
}

export function ThemeSync() {
  useLayoutEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") {
      applyTheme(stored, false);
    } else {
      applyTheme(
        window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark",
        false,
      );
    }

    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      if (localStorage.getItem(THEME_KEY)) return;
      applyTheme(media.matches ? "light" : "dark", false);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return null;
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isLight = theme === "light";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => applyTheme(isLight ? "dark" : "light", true)}
      aria-pressed={isLight}
      aria-label={isLight ? "Activar modo oscuro" : "Activar modo claro"}
    >
      <span className="theme-toggle-key">theme</span>
      <span>{theme}</span>
    </button>
  );
}
