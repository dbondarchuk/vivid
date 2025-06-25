// import { createInstance, i18n } from "i18next";
// import resourcesToBackend from "i18next-resources-to-backend";
// import { initReactI18next } from "react-i18next/initReactI18next";
// import type { I18nFn } from "./i18n";
// import { fallbackLanguage, getOptions } from "./settings";

// export type { I18nFn, I18nKeys } from "./i18n";

// const initI18next = async (language: string, namespace?: string) => {
//   const i18nInstance = createInstance();
//   await i18nInstance
//     .use(initReactI18next)
//     .use(
//       resourcesToBackend(
//         (language: string, namespace: string) =>
//           import(`./locales/${language}/${namespace}.json`)
//       )
//     )
//     .init(getOptions(language, namespace));
//   return i18nInstance;
// };

// export const getI18n = async (
//   language?: string,
//   namespace?: string,
//   options?: { keyPrefix?: string }
// ): Promise<{
//   t: I18nFn;
//   i18n: i18n;
// }> => {
//   if (!language) {
//     language = fallbackLanguage;
//   }

//   const i18nextInstance = await initI18next(language, namespace);
//   return {
//     t: i18nextInstance.getFixedT(
//       language,
//       Array.isArray(namespace) ? namespace[0] : namespace,
//       options?.keyPrefix
//     ),
//     i18n: i18nextInstance,
//   };
// };

import { fallbackLanguage, I18nFn, I18nNamespaces } from "./types";
import { i18nFunction } from "./utils";

import { headers } from "next/headers";

export const getI18nAsync = async <T extends I18nNamespaces>(
  namespace: T = "translation" as T,
  language?: string
): Promise<I18nFn<T>> => {
  if (!language) {
    const headersList = await headers();
    language = headersList.get("x-language") || fallbackLanguage;
  }

  const translations = await import(`./locales/${language}/${namespace}.json`);
  return i18nFunction(translations);
};
