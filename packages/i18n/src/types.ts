import admin from "./locales/en/admin.json";
import apps from "./locales/en/apps.json";
import builder from "./locales/en/builder.json";
import translation from "./locales/en/translation.json";
import ui from "./locales/en/ui.json";
import validation from "./locales/en/validation.json";

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

export type Translations = {
  [x: string]: Translations | string;
};

export const languages = ["en", "uk"] as const;
export const defaultNamespace: I18nNamespaces = "translation";
export const cookieName = "i18next";

export type Language = (typeof languages)[number];
export const fallbackLanguage: Language = "en";
