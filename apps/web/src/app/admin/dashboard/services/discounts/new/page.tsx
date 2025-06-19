import PageContainer from "@/components/admin/layout/page-container";
import { DiscountForm } from "@/components/admin/services/discounts/form";
import { ServicesContainer } from "@vivid/services";
import { DiscountUpdateModel } from "@vivid/types";
import { Breadcrumbs, Heading } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import { notFound } from "next/navigation";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Services", link: "/admin/dashboard/services" },
  { title: "Discounts", link: "/admin/dashboard/services/discounts" },
  { title: "New", link: "/admin/dashboard/services/discounts/new" },
];

type Props = {
  searchParams: Promise<{ from?: string }>;
};

export default async function NewDiscountPage(props: Props) {
  const logger = getLoggerFactory("AdminPages")("new-service-discount");
  const { from } = await props.searchParams;

  logger.debug(
    {
      fromDiscountId: from,
    },
    "Loading new service discount page"
  );

  let initialData: DiscountUpdateModel | undefined = undefined;
  if (from) {
    const result = await ServicesContainer.ServicesService().getDiscount(from);
    if (!result) {
      logger.warn(
        { fromDiscountId: from },
        "Source discount not found for copying"
      );
      notFound();
    }

    const { _id, updatedAt, ...field } = result;
    initialData = field;

    logger.debug(
      {
        fromDiscountId: from,
        discountName: result.name,
      },
      "Using source discount as template"
    );
  }

  logger.debug(
    {
      fromDiscountId: from,
      hasInitialData: !!initialData,
    },
    "New service discount page loaded"
  );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title="New discount" description="Add new discount" />
        </div>
        <DiscountForm initialData={initialData} />
      </div>
    </PageContainer>
  );
}
