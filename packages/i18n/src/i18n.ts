import { template } from "@vivid/utils";
import React from "react";
import admin from "./locales/en/admin.json";
import apps from "./locales/en/apps.json";
import builder from "./locales/en/builder.json";
import translation from "./locales/en/translation.json";
import ui from "./locales/en/ui.json";
import validation from "./locales/en/validation.json";
import { defaultNamespace } from "./settings";

type Leaves<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never
        ? ""
        : `.${Leaves<T[K]>}`}`;
    }[keyof T]
  : never;

export type I18nNamespaces =
  | "translation"
  | "admin"
  | "ui"
  | "apps"
  | "validation"
  | "builder";
export type TranslationKeys = Leaves<typeof translation>;
export type AdminKeys = Leaves<typeof admin>;
export type UiKeys = Leaves<typeof ui>;
export type AppsKeys = Leaves<typeof apps>;
export type ValidationKeys = Leaves<typeof validation>;
export type BuilderKeys = Leaves<typeof builder>;

export type I18nKeys =
  | TranslationKeys
  | AdminKeys
  | UiKeys
  | AppsKeys
  | ValidationKeys
  | BuilderKeys;

export type I18nKey<T extends I18nNamespaces> = T extends "translation"
  ? TranslationKeys
  : T extends "admin"
    ? AdminKeys
    : T extends "ui"
      ? UiKeys
      : T extends "apps"
        ? AppsKeys
        : T extends "validation"
          ? ValidationKeys
          : T extends "builder"
            ? BuilderKeys
            : never;

export type I18nFn<T extends I18nNamespaces> = (
  key: I18nKey<T>,
  args?: Record<string, any> | false
) => string;

export const fallbackLanguage = "en";

type Translations = {
  [x: string]: Translations | string;
};

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

const i18nFunction = <T extends I18nNamespaces>(
  translations: Translations
): I18nFn<T> => {
  return (key: I18nKeys, args?: Record<string, any> | false) =>
    args !== false
      ? template(getDeepValue(translations, key) || key, args, true)
      : getDeepValue(translations, key) || key;
};

export const getI18nAsync = async <T extends I18nNamespaces = "translation">(
  namespace?: T,
  language?: string
): Promise<I18nFn<T>> => {
  if (!language) {
    language = fallbackLanguage;
  }

  const translations = await import(`./locales/${language}/${namespace}.json`);
  return i18nFunction(translations);
};

export const useI18n = <T extends I18nNamespaces = "translation">(
  namespace?: T,
  language?: string
): I18nFn<T> => {
  if (!language) {
    language = fallbackLanguage;
  }

  if (!namespace) {
    namespace = defaultNamespace as T;
  }

  const [translations, setTranslations] = React.useState<
    Record<string, string>
  >({});

  if (!namespace) {
    namespace = defaultNamespace as T;
  }

  React.useEffect(() => {
    const fetchTranslations = async () => {
      setTranslations(await import(`./locales/${language}/${namespace}.json`));
    };

    fetchTranslations();
  }, [language, namespace]);

  return React.useMemo(() => i18nFunction(translations), [translations]);
};
