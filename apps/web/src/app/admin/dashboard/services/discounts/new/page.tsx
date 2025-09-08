import PageContainer from "@/components/admin/layout/page-container";
import { DiscountForm } from "@/components/admin/services/discounts/form";
import { getI18nAsync } from "@vivid/i18n/server";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { DiscountUpdateModel } from "@vivid/types";
import { Breadcrumbs, Heading } from "@vivid/ui";
import { notFound } from "next/navigation";
import { Metadata } from "next/types";

type Props = {
  searchParams: Promise<{ from?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18nAsync("admin");
  return {
    title: t("services.discounts.new"),
  };
}

export default async function NewDiscountPage(props: Props) {
  const logger = getLoggerFactory("AdminPages")("new-service-discount");
  const t = await getI18nAsync("admin");
  const { from } = await props.searchParams;

  logger.debug(
    {
      fromDiscountId: from,
    },
    "Loading new service discount page",
  );

  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    { title: t("navigation.services"), link: "/admin/dashboard/services" },
    {
      title: t("navigation.discounts"),
      link: "/admin/dashboard/services/discounts",
    },
    {
      title: t("services.discounts.new"),
      link: "/admin/dashboard/services/discounts/new",
    },
  ];

  let initialData: DiscountUpdateModel | undefined = undefined;
  if (from) {
    const result = await ServicesContainer.ServicesService().getDiscount(from);
    if (!result) {
      logger.warn(
        { fromDiscountId: from },
        "Source discount not found for copying",
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
      "Using source discount as template",
    );
  }

  logger.debug(
    {
      fromDiscountId: from,
      hasInitialData: !!initialData,
    },
    "New service discount page loaded",
  );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title={t("services.discounts.newTitle")}
            description={t("services.discounts.newDescription")}
          />
        </div>
        <DiscountForm initialData={initialData} />
      </div>
    </PageContainer>
  );
}
