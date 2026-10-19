"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { useI18n } from "@/components/locale";
import {
  DARK_BG,
  LIGHT_BG,
  THEME_MIX_KEY,
  clampMix,
  mixHex,
} from "@/lib/theme-mix";

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readMix() {
  return clampMix(Number.parseFloat(document.documentElement.dataset.themeMix ?? "0"));
}

function getSnapshot() {
  return readMix();
}

function getServerSnapshot() {
  return 0;
}

export function applyThemeMix(amount: number, persist: boolean) {
  const mix = clampMix(amount);
  const root = document.documentElement;
  root.style.setProperty("--mix", String(mix));
  root.dataset.themeMix = String(mix);
  root.dataset.theme = mix >= 0.5 ? "light" : "dark";
  if (persist) localStorage.setItem(THEME_MIX_KEY, String(mix));
  const color = mixHex(DARK_BG, LIGHT_BG, mix);
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute("content", color);
  });
  emit();
}

export function ThemeSync() {
  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      if (localStorage.getItem(THEME_MIX_KEY)) return;
      applyThemeMix(media.matches ? 1 : 0, false);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return null;
}

let snapTimer = 0;

function settleTheme(amount: number) {
  const root = document.documentElement;
  root.classList.add("is-snapping");
  window.requestAnimationFrame(() => {
    applyThemeMix(amount >= 0.5 ? 1 : 0, true);
  });
  window.clearTimeout(snapTimer);
  snapTimer = window.setTimeout(() => {
    root.classList.remove("is-snapping");
  }, 280);
}

export function ThemeToggle() {
  const mix = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { m } = useI18n();
  const isLight = mix >= 0.5;
  const label = isLight ? m.themeToggleToDark : m.themeToggleToLight;

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={label}
      title={label}
      onClick={() => settleTheme(isLight ? 0 : 1)}
    >
      {isLight ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M20.2 15.4A8 8 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M12 2.5v2m0 15v2m9.5-9.5h-2m-15 0h-2m16.2-6.7-1.4 1.4M6.7 17.3l-1.4 1.4m13.4 0-1.4-1.4M6.7 6.7 5.3 5.3"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.6"
          />
        </svg>
      )}
    </button>
  );
}
