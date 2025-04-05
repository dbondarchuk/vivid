import PageContainer from "@/components/admin/layout/page-container";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";

import { ServiceFieldForm } from "@/components/admin/services/fields/form";
import { ServicesContainer } from "@vivid/services";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditFieldPage(props: Props) {
  const params = await props.params;
  const field = await ServicesContainer.ServicesService().getField(params.id);

  if (!field) return notFound();

  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Services", link: "/admin/dashboard/services" },
    { title: "Fields", link: "/admin/dashboard/services/fields" },
    {
      title: field.data.label,
      link: `/admin/dashboard/services/fields/${params.id}`,
    },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title={field.data.label} description="Edit custom field" />

          <Separator />
        </div>
        <ServiceFieldForm initialData={field} />
      </div>
    </PageContainer>
  );
}
