import React from "react";
import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { AssetForm } from "@/components/admin/assets/form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Assets", link: "/admin/dashboard/assets" },
  { title: "New", link: "/admin/dashboard/assets/new" },
];

export default async function NewAssetsPage() {
  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title="New asset" description="Upload new assets" />
          <Separator />
        </div>
        <AssetForm />
      </div>
    </PageContainer>
  );
}
