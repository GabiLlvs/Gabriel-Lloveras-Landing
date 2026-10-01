export type Locale = "es" | "en";

export function isLocale(value: string | undefined): value is Locale {
  return value === "es" || value === "en";
}
