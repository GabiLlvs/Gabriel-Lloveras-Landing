import { cookies } from "next/headers";
import { isLocale, type Locale } from "@/content/locale";

export async function readLocale(): Promise<Locale> {
  const jar = await cookies();
  const value = jar.get("locale")?.value;
  return isLocale(value) ? value : "es";
}
