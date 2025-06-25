import PageContainer from "@/components/admin/layout/page-container";
import { getI18nAsync } from "@vivid/i18n/server";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading } from "@vivid/ui";
import { FooterSettingsForm } from "./form";

export default async function Page() {
  const logger = getLoggerFactory("AdminPages")("footer");
  const t = await getI18nAsync("admin");

  logger.debug("Loading footer page");
  const settings =
    await ServicesContainer.ConfigurationService().getConfiguration("footer");

  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    { title: t("navigation.appearance"), link: "/admin/dashboard" },
    {
      title: t("navigation.footer"),
      link: "/admin/dashboard/appearence/footer",
    },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title={t("appearance.footer.title")}
            description={t("appearance.footer.description")}
          />
        </div>
        <FooterSettingsForm values={settings} />
      </div>
    </PageContainer>
  );
}
