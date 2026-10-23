"use client";

import { useI18n } from "@/components/locale";

export function PixelLoader() {
  const { m } = useI18n();

  return (
    <span className="pixel-loader" role="status" aria-label={m.commandRunning}>
      {Array.from({ length: 8 }, (_, index) => (
        <span
          key={index}
          className="pixel-loader__cell"
          style={{ animationDelay: `${index * 0.11}s` }}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
