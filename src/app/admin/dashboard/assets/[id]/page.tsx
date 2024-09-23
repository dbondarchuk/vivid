import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { AssetForm } from "../../../../../components/admin/assets/form";
import { Services } from "@/lib/services";
import { notFound } from "next/navigation";
import { AssetEditForm } from "@/components/admin/assets/editForm";

type Props = {
  params: { id: string };
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Assets", link: "/admin/dashboard/assets" },
  { title: "Edit", link: "/admin/dashboard/assets" },
];

export default async function EditAssetsPage({ params }: Props) {
  const asset = await Services.AssetsService().getAsset(params.id);

  if (!asset) return notFound();

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title="Edit asset" description={asset.filename} />
          <Separator />
        </div>
        <AssetEditForm asset={asset} />
      </div>
    </PageContainer>
  );
}
