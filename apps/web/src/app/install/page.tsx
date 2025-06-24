import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { Card, CardDescription, CardHeader, CardTitle } from "@vivid/ui";
import { getI18nAsync } from "@vivid/i18n";
import { notFound } from "next/navigation";
import { InstallForm } from "./form";

export const dynamicParams = true;
export const revalidate = 60;

const logger = getLoggerFactory("InstallPage");

export default async function Page() {
  const t = await getI18nAsync("admin");
  const actionLogger = logger("Page");
  const page = await ServicesContainer.PagesService().getPageBySlug("home");
  actionLogger.debug({ page }, "Checking if website is already installed");
  if (!!page) {
    actionLogger.error(`Website is already installed.`);
    notFound();
  }

  actionLogger.debug("Website is not installed, showing install form");

  return (
    <div className="w-[100vw] min-h-[100vh] flex items-center justify-center">
      <Card className="w-full md:max-w-[80%] xl:max-w-[60%] p-2">
        <CardHeader>
          <CardTitle>{t("install.page.title")}</CardTitle>
          <CardDescription>{t("install.page.description")}</CardDescription>
        </CardHeader>
        <InstallForm />
      </Card>
    </div>
  );
}
