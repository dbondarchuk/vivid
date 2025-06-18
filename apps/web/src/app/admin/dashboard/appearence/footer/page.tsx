import PageContainer from "@/components/admin/layout/page-container";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading } from "@vivid/ui";
import { FooterSettingsForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Appearence", link: "/admin/dashboard" },
  { title: "Footer", link: "/admin/dashboard/appearence/footer" },
];

export default async function Page() {
  const logger = getLoggerFactory("AdminPages")("footer");

  logger.debug("Loading footer page");
  const settings =
    await ServicesContainer.ConfigurationService().getConfiguration("footer");

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title="Footer" description="Adjust links in footer" />
          {/* <Separator /> */}
        </div>
        <FooterSettingsForm values={settings} />
      </div>
    </PageContainer>
  );
}
