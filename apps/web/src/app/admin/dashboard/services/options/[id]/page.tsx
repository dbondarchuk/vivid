import PageContainer from "@/components/admin/layout/page-container";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";

import { OptionForm } from "@/components/admin/services/options/form";
import { ServicesContainer } from "@vivid/services";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditOptionPage(props: Props) {
  const params = await props.params;
  const option = await ServicesContainer.ServicesService().getOption(params.id);

  if (!option) return notFound();

  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Services", link: "/admin/dashboard/services" },
    { title: "Options", link: "/admin/dashboard/services/options" },
    {
      title: option.name,
      link: `/admin/dashboard/services/options/${params.id}`,
    },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title={option.name} description="Edit option" />

          {/* <Separator /> */}
        </div>
        <OptionForm initialData={option} />
      </div>
    </PageContainer>
  );
}
