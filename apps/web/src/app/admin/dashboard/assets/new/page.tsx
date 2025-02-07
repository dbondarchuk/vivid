import { AssetForm } from "@/components/admin/assets/form";
import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/pageContainer";
import { Heading, Separator } from "@vivid/ui";

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
