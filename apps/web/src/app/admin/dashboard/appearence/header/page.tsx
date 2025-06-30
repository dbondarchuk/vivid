import PageContainer from "@/components/admin/layout/page-container";
import { getI18nAsync } from "@vivid/i18n/server";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading } from "@vivid/ui";
import { Metadata } from "next";
import { HeaderSettingsForm } from "./form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18nAsync("admin");
  return {
    title: t("navigation.header"),
  };
}

export default async function Page() {
  const logger = getLoggerFactory("AdminPages")("header");
  const t = await getI18nAsync("admin");

  logger.debug("Loading header page");
  const settings =
    await ServicesContainer.ConfigurationService().getConfiguration("header");

  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    { title: t("navigation.appearance"), link: "/admin/dashboard" },
    {
      title: t("navigation.header"),
      link: "/admin/dashboard/appearence/header",
    },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title={t("appearance.header.title")}
            description={t("appearance.header.description")}
          />
        </div>
        <HeaderSettingsForm values={settings} />
      </div>
    </PageContainer>
  );
}
