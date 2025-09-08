import PageContainer from "@/components/admin/layout/page-container";
import { AddonForm } from "@/components/admin/services/addons/form";
import { getI18nAsync } from "@vivid/i18n/server";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { AppointmentAddonUpdateModel } from "@vivid/types";
import { Breadcrumbs, Heading } from "@vivid/ui";
import { notFound } from "next/navigation";
import { Metadata } from "next/types";

type Props = {
  searchParams: Promise<{ from?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18nAsync("admin");
  return {
    title: t("services.addons.new"),
  };
}

export default async function NewAddonPage(props: Props) {
  const logger = getLoggerFactory("AdminPages")("new-service-addon");
  const t = await getI18nAsync("admin");
  const { from } = await props.searchParams;

  logger.debug(
    {
      fromAddonId: from,
    },
    "Loading new service addon page",
  );

  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    { title: t("navigation.services"), link: "/admin/dashboard/services" },
    { title: t("navigation.addons"), link: "/admin/dashboard/services/addons" },
    {
      title: t("services.addons.new"),
      link: "/admin/dashboard/services/addons/new",
    },
  ];

  let initialData: AppointmentAddonUpdateModel | undefined = undefined;
  if (from) {
    const result = await ServicesContainer.ServicesService().getAddon(from);
    if (!result) {
      logger.warn({ fromAddonId: from }, "Source addon not found for copying");
      notFound();
    }

    const { _id, updatedAt, ...addon } = result;
    initialData = addon;

    logger.debug(
      {
        fromAddonId: from,
        addonName: result.name,
      },
      "Using source addon as template",
    );
  }

  logger.debug(
    {
      fromAddonId: from,
      hasInitialData: !!initialData,
    },
    "New service addon page loaded",
  );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title={t("services.addons.newTitle")}
            description={t("services.addons.newDescription")}
          />
          {/* <Separator /> */}
        </div>
        <AddonForm initialData={initialData} />
      </div>
    </PageContainer>
  );
}
