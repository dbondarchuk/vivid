import PageContainer from "@/components/admin/layout/page-container";
import { Breadcrumbs, Heading } from "@vivid/ui";

import { OptionForm } from "@/components/admin/services/options/form";
import { getI18nAsync } from "@vivid/i18n";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditOptionPage(props: Props) {
  const logger = getLoggerFactory("AdminPages")("edit-service-option");
  const t = await getI18nAsync("admin");
  const params = await props.params;

  logger.debug(
    {
      optionId: params.id,
    },
    "Loading service option edit page"
  );

  const option = await ServicesContainer.ServicesService().getOption(params.id);

  if (!option) {
    logger.warn({ optionId: params.id }, "Service option not found");
    return notFound();
  }

  logger.debug(
    {
      optionId: params.id,
      optionName: option.name,
      optionDuration: option.duration,
      optionPrice: option.price,
    },
    "Service option edit page loaded"
  );

  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    { title: t("navigation.services"), link: "/admin/dashboard/services" },
    {
      title: t("navigation.options"),
      link: "/admin/dashboard/services/options",
    },
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
          <Heading
            title={option.name}
            description={t("services.options.editDescription")}
          />

          {/* <Separator /> */}
        </div>
        <OptionForm initialData={option} />
      </div>
    </PageContainer>
  );
}
