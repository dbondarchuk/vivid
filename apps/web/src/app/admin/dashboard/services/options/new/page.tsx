import PageContainer from "@/components/admin/layout/page-container";
import { OptionForm } from "@/components/admin/services/options/form";
import { ServicesContainer } from "@vivid/services";
import { AppointmentOptionUpdateModel } from "@vivid/types";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { notFound } from "next/navigation";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Services", link: "/admin/dashboard/services" },
  { title: "Options", link: "/admin/dashboard/services/options" },
  { title: "New", link: "/admin/dashboard/services/options/new" },
];

type Props = {
  searchParams: Promise<{ from?: string }>;
};

export default async function NewOptionPage(props: Props) {
  const { from } = await props.searchParams;
  let initialData: AppointmentOptionUpdateModel | undefined = undefined;
  if (from) {
    const result = await ServicesContainer.ServicesService().getOption(from);
    if (!result) {
      notFound();
    }

    const { _id, updatedAt, ...option } = result;
    initialData = option;
  }
  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title="New service option"
            description="Add new option that you provide"
          />
          {/* <Separator /> */}
        </div>
        <OptionForm initialData={initialData} />
      </div>
    </PageContainer>
  );
}
