import PageContainer from "@/components/admin/layout/page-container";
import { ServiceFieldForm } from "@/components/admin/services/fields/form";
import { ServicesContainer } from "@vivid/services";
import { ServiceFieldUpdateModel } from "@vivid/types";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import { notFound } from "next/navigation";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Services", link: "/admin/dashboard/services" },
  { title: "Fields", link: "/admin/dashboard/services/fields" },
  { title: "New", link: "/admin/dashboard/services/fields/new" },
];

type Props = {
  searchParams: Promise<{ from?: string }>;
};

export default async function NewServicePage(props: Props) {
  const logger = getLoggerFactory("AdminPages")("new-service-field");
  const { from } = await props.searchParams;

  logger.debug(
    {
      fromFieldId: from,
    },
    "Loading new service field page"
  );

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
            title="New service field"
            description="Add new custom field"
          />
          {/* <Separator /> */}
        </div>
        <ServiceFieldForm initialData={initialData} />
      </div>
    </PageContainer>
  );
}
