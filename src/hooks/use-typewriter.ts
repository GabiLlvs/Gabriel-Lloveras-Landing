"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type Options = {
  active?: boolean;
  msPerChar?: number;
  onComplete?: () => void;
};

export function useTypewriter(text: string, options: Options = {}) {
  const { active = true, msPerChar = 16, onComplete } = options;
  const reducedMotion = usePrefersReducedMotion();
  const [displayed, setDisplayed] = useState(reducedMotion ? text : "");
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      return;
    }

    if (reducedMotion || text.length === 0) {
      setDisplayed(text);
      onCompleteRef.current?.();
      return;
    }

    setDisplayed("");
    let index = 0;
    let timer = 0;
    const tick = () => {
      index += 1;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        onCompleteRef.current?.();
        return;
      }
      timer = window.setTimeout(tick, msPerChar);
    };
    timer = window.setTimeout(tick, msPerChar);
    return () => window.clearTimeout(timer);
  }, [active, msPerChar, reducedMotion, text]);

  const done = displayed.length >= text.length;

  return { displayed, done, reducedMotion };
}
