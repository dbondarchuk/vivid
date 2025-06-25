// import { useSession } from "next-auth/react";
import React from "react";
import {
  defaultNamespace,
  fallbackLanguage,
  I18nFn,
  I18nNamespaces,
} from "./types";
import { i18nFunction } from "./utils";

const runsOnServerSide = typeof window === "undefined";

export const useI18n = <T extends I18nNamespaces>(
  namespace: T = "translation" as T,
  language?: string
): I18nFn<T> => {
  // const session = useSession();

  if (!language) {
    if (runsOnServerSide) {
      language =
        // (session.data?.user as { language: Language })?.language ||
        fallbackLanguage;
    } else {
      const htmlLang = document.documentElement.lang;
      language = htmlLang || fallbackLanguage;
    }
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
