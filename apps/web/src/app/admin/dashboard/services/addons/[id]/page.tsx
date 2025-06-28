import PageContainer from "@/components/admin/layout/page-container";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";

import { AddonForm } from "@/components/admin/services/addons/form";
import { getI18nAsync } from "@vivid/i18n/server";
import { ServicesContainer } from "@vivid/services";
import { getLoggerFactory } from "@vivid/logger";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditAddonPage(props: Props) {
  const logger = getLoggerFactory("AdminPages")("edit-service-addon");
  const t = await getI18nAsync("admin");
  const params = await props.params;

  logger.debug(
    {
      addonId: params.id,
    },
    "Loading service addon edit page"
  );

  const addon = await ServicesContainer.ServicesService().getAddon(params.id);

  if (!addon) {
    logger.warn({ addonId: params.id }, "Service addon not found");
    return notFound();
  }

  logger.debug(
    {
      addonId: params.id,
      addonName: addon.name,
      addonPrice: addon.price,
    },
    "Service addon edit page loaded"
  );

  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    { title: t("navigation.services"), link: "/admin/dashboard/services" },
    { title: t("navigation.addons"), link: "/admin/dashboard/services/addons" },
    {
      title: addon.name,
      link: `/admin/dashboard/services/addons/${params.id}`,
    },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title={addon.name}
            description={t("services.addons.editDescription")}
          />

          {/* <Separator /> */}
        </div>
        <AddonForm initialData={addon} />
      </div>
    </PageContainer>
  );
}
