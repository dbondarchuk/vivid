import PageContainer from "@/components/admin/layout/page-container";
import { getI18nAsync } from "@vivid/i18n/server";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading } from "@vivid/ui";
import { ScheduleSettingsForm } from "./form";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18nAsync("admin");
  return {
    title: t("settings.schedule.title"),
  };
}

export default async function Page() {
  const logger = getLoggerFactory("AdminPages")("schedule");
  const t = await getI18nAsync("admin");

  logger.debug("Loading schedule page");
  const schedule =
    await ServicesContainer.ConfigurationService().getConfiguration("schedule");

  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    {
      title: t("navigation.schedule"),
      link: "/admin/dashboard/settings/schedule",
    },
    {
      title: t("navigation.defaultSchedule"),
      link: "/admin/dashboard/settings/schedule",
    },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title={t("settings.schedule.title")}
            description={t("settings.schedule.description")}
          />
        </div>
        <ScheduleSettingsForm values={schedule} />
      </div>
    </PageContainer>
  );
}
