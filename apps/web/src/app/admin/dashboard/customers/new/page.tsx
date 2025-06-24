import { CustomerForm } from "@/components/admin/customers/form";
import PageContainer from "@/components/admin/layout/page-container";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import { getI18nAsync } from "@vivid/i18n";

type Props = {
  searchParams: Promise<{ from?: string }>;
};

export default async function NewCustomerPage(props: Props) {
  const logger = getLoggerFactory("AdminPages")("new-customer");
  const t = await getI18nAsync("admin");
  const searchParams = await props.searchParams;

  logger.debug(
    {
      from: searchParams.from,
    },
    "Loading new customer page"
  );

  const breadcrumbItems = [
    { title: t("assets.dashboard"), link: "/admin/dashboard" },
    { title: t("customers.title"), link: "/admin/dashboard/customers" },
    { title: t("customers.new"), link: "/admin/dashboard/customers/new" },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title={t("customers.new")}
            description={t("customers.addNewCustomer")}
          />
          {/* <Separator /> */}
        </div>
        <CustomerForm />
      </div>
    </PageContainer>
  );
}
