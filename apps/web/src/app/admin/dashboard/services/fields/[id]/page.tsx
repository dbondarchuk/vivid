import PageContainer from "@/components/admin/layout/page-container";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";

import { ServiceFieldForm } from "@/components/admin/services/fields/form";
import { getI18nAsync } from "@vivid/i18n/server";
import { ServicesContainer } from "@vivid/services";
import { getLoggerFactory } from "@vivid/logger";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditFieldPage(props: Props) {
  const logger = getLoggerFactory("AdminPages")("edit-service-field");
  const t = await getI18nAsync("admin");
  const params = await props.params;

  logger.debug(
    {
      fieldId: params.id,
    },
    "Loading service field edit page"
  );

  const field = await ServicesContainer.ServicesService().getField(params.id);

  if (!field) {
    logger.warn({ fieldId: params.id }, "Service field not found");
    return notFound();
  }

  logger.debug(
    {
      fieldId: params.id,
      fieldName: field.name,
      fieldType: field.type,
      fieldLabel: field.data.label,
    },
    "Service field edit page loaded"
  );

  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    { title: t("navigation.services"), link: "/admin/dashboard/services" },
    { title: t("navigation.fields"), link: "/admin/dashboard/services/fields" },
    {
      title: field.data.label,
      link: `/admin/dashboard/services/fields/${params.id}`,
    },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title={field.data.label}
            description={t("services.fields.editDescription")}
          />

          {/* <Separator /> */}
        </div>
        <ServiceFieldForm initialData={field} />
      </div>
    </PageContainer>
  );
}
