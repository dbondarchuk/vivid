import { CustomerForm } from "@/components/admin/customers/form";
import PageContainer from "@/components/admin/layout/page-container";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Customers", link: "/admin/dashboard/customers" },
  { title: "New", link: "/admin/dashboard/customers/new" },
];

type Props = {
  searchParams: Promise<{ from?: string }>;
};

export default async function NewCustomerPage(props: Props) {
  const logger = getLoggerFactory("AdminPages")("new-customer");
  const searchParams = await props.searchParams;

  logger.debug(
    {
      from: searchParams.from,
    },
    "Loading new customer page"
  );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title="New customer" description="Add a new customer" />
          {/* <Separator /> */}
        </div>
        <CustomerForm />
      </div>
    </PageContainer>
  );
}
