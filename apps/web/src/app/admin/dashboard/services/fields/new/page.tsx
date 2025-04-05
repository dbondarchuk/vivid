import PageContainer from "@/components/admin/layout/page-container";
import { ServiceFieldForm } from "@/components/admin/services/fields/form";
import { ServicesContainer } from "@vivid/services";
import { ServiceFieldUpdateModel } from "@vivid/types";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
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
  const { from } = await props.searchParams;
  let initialData: ServiceFieldUpdateModel | undefined = undefined;
  if (from) {
    const result = await ServicesContainer.ServicesService().getField(from);
    if (!result) {
      notFound();
    }

    const { _id, updatedAt, ...field } = result;
    initialData = field;
  }

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title="New service field"
            description="Add new custom field"
          />
          <Separator />
        </div>
        <ServiceFieldForm initialData={initialData} />
      </div>
    </PageContainer>
  );
}
