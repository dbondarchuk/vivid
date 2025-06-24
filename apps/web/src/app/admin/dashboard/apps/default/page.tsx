import PageContainer from "@/components/admin/layout/page-container";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import { DefaultAppsConfigurationForm } from "./form";
import { getI18nAsync } from "@vivid/i18n";

export default async function Page() {
  const logger = getLoggerFactory("AdminPages")("default");
  const t = await getI18nAsync("admin");

  logger.debug("Loading default page");
  const settings =
    await ServicesContainer.ConfigurationService().getConfiguration(
      "defaultApps"
    );

  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    { title: t("navigation.apps"), link: "/admin/dashboard/apps" },
    { title: t("apps.defaultApps"), link: "/admin/dashboard/apps/default" },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title={t("apps.defaultApps")}
            description={t("apps.defaultAppsDescription")}
          />
        </div>
        <DefaultAppsConfigurationForm values={settings} />
      </div>
    </PageContainer>
  );
}
