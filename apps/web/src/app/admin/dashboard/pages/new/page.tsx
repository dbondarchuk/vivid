import PageContainer from "@/components/admin/layout/page-container";
import { PageForm } from "@/components/admin/pages/form";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pages", link: "/admin/dashboard/pages" },
  { title: "New", link: "/admin/dashboard/pages/new" },
];

export default async function NewPagesPage() {
  const logger = getLoggerFactory("AdminPages")("new-page");

  logger.debug("Loading new page creation page");

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title="New page" description="Add new page" />
          {/* <Separator /> */}
        </div>
        <PageForm />
      </div>
    </PageContainer>
  );
}
