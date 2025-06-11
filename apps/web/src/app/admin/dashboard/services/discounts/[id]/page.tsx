import PageContainer from "@/components/admin/layout/page-container";
import { Breadcrumbs, Heading } from "@vivid/ui";

import { DiscountForm } from "@/components/admin/services/discounts/form";
import { ServicesContainer } from "@vivid/services";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditDiscountPage(props: Props) {
  const params = await props.params;
  const discount = await ServicesContainer.ServicesService().getDiscount(
    params.id
  );

  if (!discount) return notFound();

  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Services", link: "/admin/dashboard/services" },
    { title: "Discounts", link: "/admin/dashboard/services/discounts" },
    {
      title: discount.name,
      link: `/admin/dashboard/services/discounts/${params.id}`,
    },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title={discount.name} description="Edit discount" />
        </div>
        <DiscountForm initialData={discount} />
      </div>
    </PageContainer>
  );
}
