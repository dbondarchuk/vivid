import { AssetForm } from "@/components/admin/assets/form";
import PageContainer from "@/components/admin/layout/page-container";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Assets", link: "/admin/dashboard/assets" },
  { title: "New", link: "/admin/dashboard/assets/new" },
];

export default async function NewAssetsPage() {
  const logger = getLoggerFactory("AdminPages")("new-asset");

  logger.debug("Loading new asset page");

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title="New asset" description="Upload new assets" />
          {/* <Separator /> */}
        </div>
        <AssetForm />
      </div>
    </PageContainer>
  );
}
