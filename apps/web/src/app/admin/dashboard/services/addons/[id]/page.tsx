import PageContainer from "@/components/admin/layout/page-container";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";

import { AddonForm } from "@/components/admin/services/addons/form";
import { ServicesContainer } from "@vivid/services";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditAddonPage(props: Props) {
  const params = await props.params;
  const addon = await ServicesContainer.ServicesService().getAddon(params.id);

  if (!addon) return notFound();

  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Services", link: "/admin/dashboard/services" },
    { title: "Addons", link: "/admin/dashboard/services/addons" },
    {
      title: addon.name,
      link: `/admin/dashboard/services/addons/${params.id}`,
    },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title={addon.name} description="Edit addon" />

          <Separator />
        </div>
        <AddonForm initialData={addon} />
      </div>
    </PageContainer>
  );
}
