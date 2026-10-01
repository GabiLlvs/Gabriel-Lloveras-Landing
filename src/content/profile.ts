import type { Locale } from "@/content/locale";

export const profile: Record<
  Locale,
  {
    lead: readonly string[];
    about: readonly string[];
    languages: readonly { name: string; level: string }[];
  }
> = {
  es: {
    lead: [
      "Aplicaciones web con React, TypeScript y Next.js.",
      "De la interfaz a la lógica de negocio.",
    ],
    about: [
      "Fullstack Developer. En la interfaz trabajo con React, TypeScript y Next.js; en backend, con Java, C# y Node.js. Desarrollo aplicaciones web y sistemas en los que la interfaz tiene que sostener lógica de negocio: estado, formularios, validaciones y datos que llegan por APIs REST.",
      "No solo implemento pantallas. Diseño componentes reutilizables, cuido la experiencia de uso y trabajo con producto y diseño en equipos ágiles.",
    ],
    languages: [
      { name: "Español", level: "Nativo" },
      { name: "Inglés", level: "Conversacional (C1)" },
    ],
  },
  en: {
    lead: [
      "Web applications with React, TypeScript, and Next.js.",
      "From the interface to the business logic.",
    ],
    about: [
      "Fullstack Developer. On the interface I work with React, TypeScript, and Next.js; on the backend, with Java, C#, and Node.js. I build web applications and systems where the interface has to carry business logic: state, forms, validation, and data arriving through REST APIs.",
      "I don't only implement screens. I design reusable components, look after the experience, and work with product and design on agile teams.",
    ],
    languages: [
      { name: "Spanish", level: "Native" },
      { name: "English", level: "Conversational (C1)" },
    ],
  },
};
