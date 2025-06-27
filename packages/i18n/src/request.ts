import { ServicesContainer } from "@vivid/services";
import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

export const config = getRequestConfig(async ({ locale: baseLocale }) => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const headersList = await headers();

  const isAdminPath = headersList.get("x-is-admin-path") === "true";

  let locale =
    baseLocale ||
    (await ServicesContainer.ConfigurationService().getConfiguration("general"))
      .language ||
    "en";

  const messages: Record<string, any> = {
    translation: (await import(`./locales/${locale}/translation.json`)).default,
    ui: (await import(`./locales/${locale}/ui.json`)).default,
    validation: (await import(`./locales/${locale}/validation.json`)).default,
  };

  if (isAdminPath) {
    messages.admin = (await import(`./locales/${locale}/admin.json`)).default;
    messages.apps = (await import(`./locales/${locale}/apps.json`)).default;
    messages.builder = (
      await import(`./locales/${locale}/builder.json`)
    ).default;
  }

  return {
    locale,
    onError: (error) => console.error(error),
    getMessageFallback: ({ namespace, key }) => `${namespace}.${key}`,

    messages,
  };
});
