import PageContainer from "@/components/admin/layout/page-container";
import { AddonForm } from "@/components/admin/services/addons/form";
import { ServicesContainer } from "@vivid/services";
import { AppointmentAddonUpdateModel } from "@vivid/types";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
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
  const { from } = await props.searchParams;
  let initialData: AppointmentAddonUpdateModel | undefined = undefined;
  if (from) {
    const result = await ServicesContainer.ServicesService().getAddon(from);
    if (!result) {
      notFound();
    }

    const { _id, updatedAt, ...addon } = result;
    initialData = addon;
  }

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
