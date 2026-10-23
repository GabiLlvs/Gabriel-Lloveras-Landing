export type ScrollTargetOptions = {
  destination: string;
  focus?: boolean;
};

function scrollInsetTop() {
  const header = document.querySelector("header");
  return header?.getBoundingClientRect().bottom ?? 0;
}

function scrollInsetBottom() {
  const dock = document.querySelector(".console-dock");
  return dock?.getBoundingClientRect().top ?? window.innerHeight;
}

function isWithinScrollViewport(element: Element, padding = 24) {
  const rect = element.getBoundingClientRect();
  const top = scrollInsetTop() + padding;
  const bottom = scrollInsetBottom() - padding;
  return rect.top >= top && rect.bottom <= bottom;
}

export function scrollToTarget({ destination, focus }: ScrollTargetOptions) {
  const target = document.getElementById(destination);
  if (!target) return false;

  const targetStyle = getComputedStyle(target);
  const scrollPadding = Number.parseFloat(
    getComputedStyle(document.documentElement).scrollPaddingTop,
  );
  const scrollMargin = Number.parseFloat(targetStyle.scrollMarginTop);
  const alignedOffset =
    (Number.isFinite(scrollPadding) ? scrollPadding : 0) +
    (Number.isFinite(scrollMargin) ? scrollMargin : 0);
  const aligned = Math.abs(target.getBoundingClientRect().top - alignedOffset) <= 2;

  if (!aligned) {
    target.scrollIntoView({ block: "start", behavior: "smooth" });
  } else {
    window.dispatchEvent(new Event("scrollend"));
  }

  if (focus) {
    const heading = target.querySelector("h1, h2, h3");
    if (heading instanceof HTMLElement) {
      heading.focus({ preventScroll: true });
    }
  }

  return true;
}

export function scrollSessionLogIfNeeded() {
  const log = document.querySelector("#session .term-log");
  const session = document.getElementById("session");
  const target =
    log instanceof HTMLElement && log.dataset.empty !== "true"
      ? log
      : session;
  if (!target) return;
  if (isWithinScrollViewport(target)) return;
  target.scrollIntoView({ block: "nearest", behavior: "smooth" });
}
