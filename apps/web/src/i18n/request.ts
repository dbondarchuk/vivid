import { getConfig } from "@vivid/i18n/request";
import { ServicesContainer } from "@vivid/services";
import { headers } from "next/headers";

const config = getConfig(async (baseLocale: string | undefined) => {
  const headersList = await headers();

  const isAdminPath = headersList.get("x-is-admin-path") === "true";

  let locale =
    baseLocale ||
    headersList.get("x-locale") ||
    (await ServicesContainer.ConfigurationService().getConfiguration("general"))
      .language ||
    "en";

  const pathname = headersList.get("x-pathname");
  if (pathname && !isAdminPath) {
    const trimmedPathname = pathname.replace(/^\//, "");
    const page =
      await ServicesContainer.PagesService().getPageBySlug(trimmedPathname);

    if (page?.language) {
      locale = page.language;
    }
  }

  return { locale, includeAdmin: isAdminPath };
});

export default config;
