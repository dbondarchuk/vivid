import { template } from "@vivid/utils";
import { I18nFn, I18nKeys, I18nNamespaces, Translations } from "./types";

function getDeepValue(translations: Translations, path: string) {
  const keys = path.split(".");
  return keys.reduce((currentValue: any, key) => {
    // If currentValue is null or undefined, further access would throw an error.
    // So, we stop and return undefined.
    if (currentValue === null || typeof currentValue === "undefined") {
      return undefined;
    }
    return currentValue[key];
  }, translations);
}

export const i18nFunction = <T extends I18nNamespaces>(
  translations: Translations
): I18nFn<T> => {
  return (key: I18nKeys, args?: Record<string, any> | false) =>
    args !== false
      ? template(getDeepValue(translations, key) || key, args, true)
      : getDeepValue(translations, key) || key;
};
