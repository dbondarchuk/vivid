import PageContainer from "@/components/admin/layout/page-container";
import { AddonForm } from "@/components/admin/services/addons/form";
import { ServicesContainer } from "@vivid/services";
import { AppointmentAddonUpdateModel } from "@vivid/types";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import { notFound } from "next/navigation";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Services", link: "/admin/dashboard/services" },
  { title: "Addons", link: "/admin/dashboard/services/addons" },
  { title: "New", link: "/admin/dashboard/services/addons/new" },
];

type Props = {
  searchParams: Promise<{ from?: string }>;
};

export default async function NewAddonPage(props: Props) {
  const logger = getLoggerFactory("AdminPages")("new-service-addon");
  const { from } = await props.searchParams;

  logger.debug(
    {
      fromAddonId: from,
    },
    "Loading new service addon page"
  );

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
      "Using source addon as template"
    );
  }

  logger.debug(
    {
      fromAddonId: from,
      hasInitialData: !!initialData,
    },
    "New service addon page loaded"
  );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title="New addon" description="Add new addon" />
          {/* <Separator /> */}
        </div>
        <AddonForm initialData={initialData} />
      </div>
    </PageContainer>
  );
}
