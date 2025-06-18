import PageContainer from "@/components/admin/layout/page-container";
import { Breadcrumbs, Heading } from "@vivid/ui";

import { DiscountForm } from "@/components/admin/services/discounts/form";
import { ServicesContainer } from "@vivid/services";
import { getLoggerFactory } from "@vivid/logger";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditDiscountPage(props: Props) {
  const logger = getLoggerFactory("AdminPages")("edit-service-discount");
  const params = await props.params;

  logger.debug(
    {
      discountId: params.id,
    },
    "Loading service discount edit page"
  );

  const discount = await ServicesContainer.ServicesService().getDiscount(
    params.id
  );

  if (!discount) {
    logger.warn({ discountId: params.id }, "Service discount not found");
    return notFound();
  }

  logger.debug(
    {
      discountId: params.id,
      discountName: discount.name,
      discountType: discount.type,
      discountValue: discount.value,
    },
    "Service discount edit page loaded"
  );

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
