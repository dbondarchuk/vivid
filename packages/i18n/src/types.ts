import type admin from "./locales/en/admin.json";
import type apps from "./locales/en/apps.json";
import type builder from "./locales/en/builder.json";
import type translation from "./locales/en/translation.json";
import type ui from "./locales/en/ui.json";
import type validation from "./locales/en/validation.json";

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

type _I18nKey<T extends I18nNamespaces> = T extends "translation"
  ? TranslationKeys
  : T extends "admin"
    ? AdminKeys
    : T extends "ui"
      ? UiKeys
      : T extends "apps"
        ? AppsKeys
        : T extends "validation"
          ? ValidationKeys
          : // : T extends "builder"
            //   ? BuilderKeys
            //   : never;
            BuilderKeys;

export type AllKeys = {
  [K in I18nNamespaces]: `${K}.${_I18nKey<K>}`;
}[I18nNamespaces];

export type I18nKey<T extends I18nNamespaces | undefined> = T extends undefined
  ? AllKeys
  : _I18nKey<NonNullable<T>>;

type I18nBaseFn<T extends I18nNamespaces | undefined> = (
  key: I18nKey<T>,
  args?: Record<string, any>,
) => string;

export type ChangeReturnType<T extends (...args: any[]) => any, NewReturn> = (
  ...args: Parameters<T>
) => NewReturn;

export type I18nFn<T extends I18nNamespaces | undefined> = I18nBaseFn<T> & {
  rich: ChangeReturnType<I18nBaseFn<T>, React.ReactNode>;
  markup: I18nBaseFn<T>;
  raw: ChangeReturnType<I18nBaseFn<T>, any>;
  has: (key: I18nKey<T>) => boolean;
};

// export type Translations = {
//   [x: string]: Translations | string;
// };

// export const defaultNamespace: I18nNamespaces = "translation";

export const languages = ["en", "uk"] as const;
export type Language = (typeof languages)[number];
export const fallbackLanguage: Language = "en";
