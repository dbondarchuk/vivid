import PageContainer from "@/components/admin/layout/page-container";
import { getI18nAsync } from "@vivid/i18n/server";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading } from "@vivid/ui";
import { Metadata } from "next";
import { StylingsConfigurationForm } from "./form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18nAsync("admin");
  return {
    title: t("navigation.styling"),
  };
}

export default async function Page() {
  const logger = getLoggerFactory("AdminPages")("styling");
  const t = await getI18nAsync("admin");

  logger.debug("Loading styling page");
  const settings =
    await ServicesContainer.ConfigurationService().getConfiguration("styling");

  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    { title: t("navigation.appearance"), link: "/admin/dashboard" },
    {
      title: t("navigation.styling"),
      link: "/admin/dashboard/appearence/styling",
    },
  ];

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title={t("appearance.styling.title")}
            description={t("appearance.styling.description")}
          />
        </div>
        <StylingsConfigurationForm values={settings} />
      </div>
    </PageContainer>
  );
}
