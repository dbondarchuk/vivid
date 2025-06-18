import PageContainer from "@/components/admin/layout/page-container";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading } from "@vivid/ui";
import { ScheduleSettingsForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Schedule", link: "/admin/dashboard/settings/schedule" },
  { title: "Default schedule", link: "/admin/dashboard/settings/schedule" },
];

export default async function Page() {
  const logger = getLoggerFactory("AdminPages")("schedule");

  logger.debug("Loading schedule page");
  const schedule =
    await ServicesContainer.ConfigurationService().getConfiguration("schedule");

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title="Default schedule"
            description="Set your base schedule"
          />
          {/* <Separator /> */}
        </div>
        <ScheduleSettingsForm values={schedule} />
      </div>
    </PageContainer>
  );
}
