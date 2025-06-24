import PageContainer from "@/components/admin/layout/page-container";
import { getI18nAsync } from "@vivid/i18n";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import { SocialSettingsForm } from "./form";

export default async function Page() {
  const logger = getLoggerFactory("AdminPages")("social");
  const t = await getI18nAsync("admin");

  logger.debug("Loading social page");
  const settings =
    await ServicesContainer.ConfigurationService().getConfiguration("social");

  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    { title: t("navigation.settings"), link: "/admin/dashboard" },
    { title: t("navigation.social"), link: "/admin/dashboard/settings/social" },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title={t("settings.social.title")}
            description={t("settings.social.description")}
          />
        </div>
        <SocialSettingsForm values={settings} />
      </div>
    </PageContainer>
  );
}
