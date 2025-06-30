import PageContainer from "@/components/admin/layout/page-container";
import { ServiceFieldForm } from "@/components/admin/services/fields/form";
import { getI18nAsync } from "@vivid/i18n/server";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { ServiceFieldUpdateModel } from "@vivid/types";
import { Breadcrumbs, Heading } from "@vivid/ui";
import { notFound } from "next/navigation";
import { Metadata } from "next/types";

type Props = {
  searchParams: Promise<{ from?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18nAsync("admin");
  return {
    title: t("services.fields.new"),
  };
}

export default async function NewServicePage(props: Props) {
  const logger = getLoggerFactory("AdminPages")("new-service-field");
  const t = await getI18nAsync("admin");
  const { from } = await props.searchParams;

  logger.debug(
    {
      fromFieldId: from,
    },
    "Loading new service field page"
  );

  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    { title: t("navigation.services"), link: "/admin/dashboard/services" },
    { title: t("navigation.fields"), link: "/admin/dashboard/services/fields" },
    {
      title: t("services.fields.new"),
      link: "/admin/dashboard/services/fields/new",
    },
  ];

  let initialData: ServiceFieldUpdateModel | undefined = undefined;
  if (from) {
    const result = await ServicesContainer.ServicesService().getField(from);
    if (!result) {
      logger.warn({ fromFieldId: from }, "Source field not found for copying");
      notFound();
    }

    const { _id, updatedAt, ...field } = result;
    initialData = field;

    logger.debug(
      {
        fromFieldId: from,
        fieldName: result.name,
        fieldType: result.type,
      },
      "Using source field as template"
    );
  }

  logger.debug(
    {
      fromFieldId: from,
      hasInitialData: !!initialData,
    },
    "New service field page loaded"
  );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title={t("services.fields.newTitle")}
            description={t("services.fields.newDescription")}
          />
          {/* <Separator /> */}
        </div>
        <ServiceFieldForm initialData={initialData} />
      </div>
    </PageContainer>
  );
}
