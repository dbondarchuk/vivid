import { AssetEditForm } from "@/components/admin/assets/edit-form";
import PageContainer from "@/components/admin/layout/page-container";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import { getI18nAsync } from "@vivid/i18n";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditAssetsPage(props: Props) {
  const logger = getLoggerFactory("AdminPages")("edit-asset");
  const t = await getI18nAsync("admin");
  const params = await props.params;

  logger.debug(
    {
      assetId: params.id,
    },
    "Loading asset edit page"
  );

  const asset = await ServicesContainer.AssetsService().getAsset(params.id);

  if (!asset) {
    logger.warn({ assetId: params.id }, "Asset not found");
    return notFound();
  }

  logger.debug(
    {
      assetId: params.id,
      filename: asset.filename,
      mimeType: asset.mimeType,
    },
    "Asset edit page loaded"
  );

  const breadcrumbItems = [
    { title: t("assets.dashboard"), link: "/admin/dashboard" },
    { title: t("assets.title"), link: "/admin/dashboard/assets" },
    { title: t("assets.editPage"), link: "/admin/dashboard/assets" },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title={t("assets.edit")} description={asset.filename} />
          {/* <Separator /> */}
        </div>
        <AssetEditForm asset={asset} />
      </div>
    </PageContainer>
  );
}
