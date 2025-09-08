"use client";

import {
  useFormatter as useFormatterNext,
  useLocale as useLocaleNext,
  useTranslations,
} from "next-intl";
import { I18nFn, I18nNamespaces } from "./types";

export const useI18n = <T extends I18nNamespaces | undefined = undefined>(
  namespace?: T,
) => useTranslations(namespace as any) as I18nFn<T>;

export const useLocale = useLocaleNext;

export const useFormatter = useFormatterNext;
