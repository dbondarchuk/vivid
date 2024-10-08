import { InitOptions } from "i18next";

export const fallbackLanguage = "en";
export const languages = [fallbackLanguage, "uk"];
export const defaultNamespace = "translation";
export const cookieName = "i18next";

export function getOptions(
  language = fallbackLanguage,
  namespace = defaultNamespace
): InitOptions {
  return {
    supportedLngs: languages,
    fallbackLng: fallbackLanguage,
    lng: language,
    fallbackNS: defaultNamespace,
    defaultNS: defaultNamespace,
    ns: namespace,
  };
}
