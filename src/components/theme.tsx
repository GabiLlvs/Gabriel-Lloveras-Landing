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
let snapping = false;

function settleTheme(amount: number) {
  const root = document.documentElement;
  snapping = true;
  root.classList.add("is-snapping");
  window.requestAnimationFrame(() => {
    applyThemeMix(amount >= 0.5 ? 1 : 0, true);
  });
  window.clearTimeout(snapTimer);
  snapTimer = window.setTimeout(() => {
    snapping = false;
    root.classList.remove("is-snapping");
  }, 280);
}

export function ThemeSlider() {
  const mix = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { m } = useI18n();

  return (
    <label className="theme-slider">
      <span className="theme-name">{m.themeName}</span>
      <span className="theme-end">
        <span className="theme-swatch is-dark" aria-hidden="true" />
        {m.themeDark}
      </span>
      <input
        aria-label={m.theme}
        className="theme-range"
        type="range"
        min={0}
        max={1000}
        step={1}
        value={Math.round(mix * 1000)}
        onPointerDown={() => document.documentElement.classList.remove("is-snapping")}
        onChange={(event) => {
          if (snapping) return;
          applyThemeMix(Number(event.target.value) / 1000, false);
        }}
        onPointerUp={(event) => settleTheme(Number(event.currentTarget.value) / 1000)}
        onPointerCancel={(event) => settleTheme(Number(event.currentTarget.value) / 1000)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "End") {
            event.preventDefault();
            settleTheme(1);
          }
          if (event.key === "ArrowLeft" || event.key === "ArrowDown" || event.key === "Home") {
            event.preventDefault();
            settleTheme(0);
          }
        }}
      />
      <span className="theme-end">
        <span className="theme-swatch is-light" aria-hidden="true" />
        {m.themeLight}
      </span>
    </label>
  );
}
