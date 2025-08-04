import { getRequestConfig } from "next-intl/server";

export const getConfig = (
  getLocale: (
    baseLocale: string | undefined
  ) => Promise<{ locale: string; includeAdmin: boolean }>
) =>
  getRequestConfig(async ({ locale: baseLocale }) => {
    const { locale, includeAdmin } = await getLocale(baseLocale);

    const messages: Record<string, any> = {
      translation: (await import(`./locales/${locale}/translation.json`))
        .default,
      ui: (await import(`./locales/${locale}/ui.json`)).default,
      validation: (await import(`./locales/${locale}/validation.json`)).default,
      apps: (await import(`./locales/${locale}/apps.json`)).default,
    };

    if (includeAdmin) {
      messages.admin = (await import(`./locales/${locale}/admin.json`)).default;
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
