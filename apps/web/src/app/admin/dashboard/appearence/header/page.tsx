import PageContainer from "@/components/admin/layout/page-container";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import { HeaderSettingsForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Appearence", link: "/admin/dashboard" },
  { title: "Header", link: "/admin/dashboard/appearence/header" },
];

export default async function Page() {
  const logger = getLoggerFactory("AdminPages")("header");

  logger.debug("Loading header page");
  const settings =
    await ServicesContainer.ConfigurationService().getConfiguration("header");

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title="Header menu"
            description="Adjust links and style of the header"
          />
          {/* <Separator /> */}
        </div>
        <HeaderSettingsForm values={settings} />
      </div>
    </PageContainer>
  );
}
