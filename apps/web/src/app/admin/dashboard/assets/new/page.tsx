import { AssetForm } from "@/components/admin/assets/form";
import PageContainer from "@/components/admin/layout/page-container";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import { getI18nAsync } from "@vivid/i18n/server";

export default async function NewAssetsPage() {
  const logger = getLoggerFactory("AdminPages")("new-asset");
  const t = await getI18nAsync("admin");

  logger.debug("Loading new asset page");

  const breadcrumbItems = [
    { title: t("assets.dashboard"), link: "/admin/dashboard" },
    { title: t("assets.title"), link: "/admin/dashboard/assets" },
    { title: t("assets.newPage"), link: "/admin/dashboard/assets/new" },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title={t("assets.new")}
            description={t("assets.uploadNewAssets")}
          />
          {/* <Separator /> */}
        </div>
        <AssetForm />
      </div>
    </PageContainer>
  );
}
