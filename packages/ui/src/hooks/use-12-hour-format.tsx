import { useLocale } from "@vivid/i18n";
import { is12hourUserTimeFormat } from "@vivid/utils";

export const use12HourFormat = () => {
  const locale = useLocale();
  return is12hourUserTimeFormat(locale);
};
