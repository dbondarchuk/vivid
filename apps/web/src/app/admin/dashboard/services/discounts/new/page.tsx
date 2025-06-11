import PageContainer from "@/components/admin/layout/page-container";
import { DiscountForm } from "@/components/admin/services/discounts/form";
import { ServicesContainer } from "@vivid/services";
import { DiscountUpdateModel } from "@vivid/types";
import { Breadcrumbs, Heading } from "@vivid/ui";
import { notFound } from "next/navigation";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Services", link: "/admin/dashboard/services" },
  { title: "Discounts", link: "/admin/dashboard/services/discounts" },
  { title: "New", link: "/admin/dashboard/services/discounts/new" },
];

type Props = {
  searchParams: Promise<{ from?: string }>;
};

export default async function NewDiscountPage(props: Props) {
  const { from } = await props.searchParams;
  let initialData: DiscountUpdateModel | undefined = undefined;
  if (from) {
    const result = await ServicesContainer.ServicesService().getDiscount(from);
    if (!result) {
      notFound();
    }

    const { _id, updatedAt, ...field } = result;
    initialData = field;
  }

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title="New discount" description="Add new discount" />
        </div>
        <DiscountForm initialData={initialData} />
      </div>
    </PageContainer>
  );
}
