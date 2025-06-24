import PageContainer from "@/components/admin/layout/page-container";
import { OptionForm } from "@/components/admin/services/options/form";
import { getI18nAsync } from "@vivid/i18n";
import { ServicesContainer } from "@vivid/services";
import { AppointmentOptionUpdateModel } from "@vivid/types";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import { notFound } from "next/navigation";

type Props = {
  searchParams: Promise<{ from?: string }>;
};

export default async function NewOptionPage(props: Props) {
  const logger = getLoggerFactory("AdminPages")("new-service-option");
  const t = await getI18nAsync("admin");
  const { from } = await props.searchParams;

  logger.debug(
    {
      fromOptionId: from,
    },
    "Loading new service option page"
  );

  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    { title: t("navigation.services"), link: "/admin/dashboard/services" },
    {
      title: t("navigation.options"),
      link: "/admin/dashboard/services/options",
    },
    {
      title: t("services.options.new"),
      link: "/admin/dashboard/services/options/new",
    },
  ];

  let initialData: AppointmentOptionUpdateModel | undefined = undefined;
  if (from) {
    const result = await ServicesContainer.ServicesService().getOption(from);
    if (!result) {
      logger.warn(
        { fromOptionId: from },
        "Source option not found for copying"
      );
      notFound();
    }

    const { _id, updatedAt, ...option } = result;
    initialData = option;

    logger.debug(
      {
        fromOptionId: from,
        optionName: result.name,
      },
      "Using source option as template"
    );
  }

  logger.debug(
    {
      fromOptionId: from,
      hasInitialData: !!initialData,
    },
    "New service option page loaded"
  );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title={t("services.options.newTitle")}
            description={t("services.options.newDescription")}
          />
        </div>
        <OptionForm initialData={initialData} />
      </div>
    </PageContainer>
  );
}
