import { template } from "@vivid/utils";
import React from "react";
import translation from "./locales/en/translation.json";

export type I18nKeys = keyof typeof translation;

export type I18nFn = (key: I18nKeys, args?: Record<string, any>) => string;

export const fallbackLanguage = "en";

const i18nFunction = (translations: Record<string, string>): I18nFn => {
  return (key: I18nKeys, args?: Record<string, any>) =>
    template(translations[key] || key, args);
};

export const getI18nAsync = async (language?: string): Promise<I18nFn> => {
  if (!language) language = fallbackLanguage;

  const translations = await import(`./locales/${language}/translation.json`);
  return i18nFunction(translations);
};

export const useI18n = (language?: string): I18nFn => {
  if (!language) language = fallbackLanguage;
  const [translations, setTranslations] = React.useState<
    Record<string, string>
  >({});

  React.useEffect(() => {
    const fetchTranslations = async () => {
      setTranslations(await import(`./locales/${language}/translation.json`));
    };

    fetchTranslations();
  }, [language]);

  return React.useMemo(() => i18nFunction(translations), [translations]);
};
