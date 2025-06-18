import { globalCssColors } from "@/app/tailwind-colors";
import PageContainer from "@/components/admin/layout/page-container";
// import { Editor } from "@vivid/page-builder";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pages", link: "/admin/dashboard/pages" },
];

export default async function Page() {
  const logger = getLoggerFactory("AdminPages")("page-builder");

  logger.debug("Loading page builder");

  const styling =
    await ServicesContainer.ConfigurationService().getConfiguration("styling");

  logger.debug(
    {
      hasStylingConfig: !!styling,
    },
    "Page builder loaded"
  );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-start justify-between">
            <Heading title="Pages" description="Manage pages" />
          </div>
          {/* <Separator /> */}
        </div>
        {/* <Editor styling={styling} globalCss={globalCssColors} /> */}
      </div>
    </PageContainer>
  );
}
