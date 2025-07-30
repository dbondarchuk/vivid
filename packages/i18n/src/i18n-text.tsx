"use client";
import { useI18n } from "./client";
import { AllKeys } from "./types";

export const I18nText = ({ key }: { key: AllKeys }) => {
  const t = useI18n();
  return t(key);
};
