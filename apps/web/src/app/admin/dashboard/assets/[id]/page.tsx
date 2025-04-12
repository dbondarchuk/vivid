import { AssetEditForm } from "@/components/admin/assets/edit-form";
import PageContainer from "@/components/admin/layout/page-container";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Assets", link: "/admin/dashboard/assets" },
  { title: "Edit", link: "/admin/dashboard/assets" },
];

export default async function EditAssetsPage(props: Props) {
  const params = await props.params;
  const asset = await ServicesContainer.AssetsService().getAsset(params.id);

  if (!asset) return notFound();

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title="Edit asset" description={asset.filename} />
          <Separator />
        </div>
        <AssetEditForm asset={asset} />
      </div>
    </PageContainer>
  );
}
