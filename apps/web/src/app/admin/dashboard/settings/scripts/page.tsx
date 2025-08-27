import PageContainer from "@/components/admin/layout/page-container";
import { getI18nAsync } from "@vivid/i18n/server";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading } from "@vivid/ui";
import { Metadata } from "next";
import { ScriptsSettingsForm } from "./form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18nAsync("admin");
  return {
    title: t("settings.scripts.title"),
  };
}

export default async function Page() {
  const logger = getLoggerFactory("AdminPages")("scripts");
  const t = await getI18nAsync("admin");

  logger.debug("Loading scripts page");
  const settings =
    await ServicesContainer.ConfigurationService().getConfiguration("scripts");

  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    { title: t("navigation.settings"), link: "/admin/dashboard" },
    {
      title: t("navigation.scripts"),
      link: "/admin/dashboard/settings/scripts",
    },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title={t("settings.scripts.title")}
            description={t("settings.scripts.description")}
          />
        </div>
        <ScriptsSettingsForm values={settings} />
      </div>
    </PageContainer>
  );
}
