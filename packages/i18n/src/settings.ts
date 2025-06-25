import { InitOptions } from "i18next";
import { defaultNamespace, fallbackLanguage, languages } from "./types";

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
