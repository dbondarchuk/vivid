import PageContainer from "@/components/admin/layout/page-container";
import {
  Breadcrumbs,
  DataTableSkeleton,
  Heading,
  Link,
  Tabs,
  TabsContent,
  TabsLinkTrigger,
  TabsList,
} from "@vivid/ui";

import { AppointmentsTableColumnsCount } from "@/components/admin/appointments/table/columns";
import {
  searchParamsCache as appointmentsSearchParamsCache,
  serialize as appointmentsSerialize,
} from "@/components/admin/appointments/table/search-params";
import { AppointmentsTable } from "@/components/admin/appointments/table/table";
import { AppointmentsTableAction } from "@/components/admin/appointments/table/table-action";
import {
  searchParamsCache as assetsSearchParamsCache,
  serialize as assetsSerialize,
} from "@/components/admin/assets/table/search-params";
import { AssetsTableAction } from "@/components/admin/assets/table/table-action";
import {
  searchParamsCache as communicationsSearchParamsCache,
  serialize as communicationsSerialize,
} from "@/components/admin/communication-logs/table/search-params";
import { CommunicationLogsTableAction } from "@/components/admin/communication-logs/table/table-action";
import { CustomerForm } from "@/components/admin/customers/form";
import { ServicesContainer } from "@vivid/services";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  RecentCommunications,
  SendCommunicationButton,
} from "../../../../../../components/admin/communications/communications";
import { CustomerFiles, CustomerFileUpload } from "./files";
import { CalendarClock } from "lucide-react";

type Props = {
  params: Promise<{ id: string; tab: string }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const detailsTab = "details";
const appointmentsTab = "appointments";
const filesTab = "files";
const communicationsTab = "communications";

const tabs = [
  detailsTab,
  appointmentsTab,
  filesTab,
  communicationsTab,
] as const;

const scrollableTabs = [detailsTab, communicationsTab, filesTab];

type Tab = (typeof tabs)[number];
const tabTitle: Record<Tab, string> = {
  [detailsTab]: "Details",
  [appointmentsTab]: "Appointments",
  [filesTab]: "Files",
  [communicationsTab]: "Communications",
};

export default async function CustomerPage(props: Props) {
  const params = await props.params;
  const path = `/admin/dashboard/customers/${params.id}`;

  const activeTab = params.tab as Tab;
  if (!tabs.includes(activeTab)) notFound();

  const searchParams = await props.searchParams;

  let key: string = "";
  if (activeTab === appointmentsTab) {
    const parsed = appointmentsSearchParamsCache.parse(searchParams);
    key = appointmentsSerialize({ ...parsed });
  } else if (activeTab === filesTab) {
    const parsed = assetsSearchParamsCache.parse(searchParams);
    key = assetsSerialize({ ...parsed });
  } else if (activeTab === communicationsTab) {
    const parsed = communicationsSearchParamsCache.parse(searchParams);
    key = communicationsSerialize({ ...parsed });
  }

  const customer = await ServicesContainer.CustomersService().getCustomer(
    params.id
  );

  if (!customer) return notFound();

  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Customers", link: "/admin/dashboard/customers" },
    {
      title: customer.name,
      link: `/admin/dashboard/customers/${params.id}`,
    },
    // {
    //   title: tabTitle[activeTab],
    //   subItems: tabs.map((t) => ({
    //     title: tabTitle[t],
    //     link: `/admin/dashboard/customers/${params.id}/${t}`,
    //   })),
    // },
  ];

  return (
    <PageContainer scrollable={scrollableTabs.includes(activeTab)}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title={customer.name} description="Manage customer" />

          {/* <Separator /> */}
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <Tabs value={activeTab} className="flex-1 flex flex-col gap-4">
            <TabsList className="w-full [&>a]:flex-1 bg-card border flex-wrap h-auto">
              {tabs.map((t) => (
                <TabsLinkTrigger value={t} usePath={path} key={t}>
                  {tabTitle[t]}
                </TabsLinkTrigger>
              ))}
            </TabsList>
            <TabsContent value={detailsTab}>
              {activeTab === detailsTab && (
                <CustomerForm initialData={customer} />
              )}
            </TabsContent>
            {activeTab === appointmentsTab && (
              <TabsContent
                value={appointmentsTab}
                className="flex flex-1 flex-col gap-4"
              >
                <div className="flex flex-col md:flex-row gap-2 w-full">
                  <AppointmentsTableAction className="flex-1" />
                  <Link
                    button
                    href={`/admin/dashboard/appointments/new?customer=${params.id}`}
                    variant="default"
                  >
                    <CalendarClock className="mr-2 h-4 w-4" />{" "}
                    <span className="max-md:hidden">Schedule Appointment</span>
                    <span className="md:hidden">Add New</span>
                  </Link>
                </div>
                <Suspense
                  key={key}
                  fallback={
                    <DataTableSkeleton
                      columnCount={AppointmentsTableColumnsCount}
                      rowCount={10}
                    />
                  }
                >
                  <AppointmentsTable customerId={params.id} />
                </Suspense>
              </TabsContent>
            )}
            {activeTab === filesTab && (
              <TabsContent
                value={filesTab}
                className="flex-1 flex flex-col gap-4"
              >
                <div className="flex flex-col md:flex-row gap-2 w-full">
                  <AssetsTableAction className="flex-1" />
                  <CustomerFileUpload customerId={params.id} />
                </div>
                <CustomerFiles
                  customerId={params.id}
                  search={assetsSearchParamsCache.get("search")}
                  key={searchParams.key as string}
                />
              </TabsContent>
            )}
            {activeTab === communicationsTab && (
              <TabsContent
                value={communicationsTab}
                className="flex-1 flex flex-col gap-4"
              >
                <div className="flex flex-col md:flex-row gap-2 w-full">
                  <CommunicationLogsTableAction
                    hideActions
                    className="flex-1"
                  />
                  <SendCommunicationButton customerId={params.id} />
                </div>
                <RecentCommunications
                  customerId={params.id}
                  direction={communicationsSearchParamsCache.get("direction")}
                  channel={communicationsSearchParamsCache.get("channel")}
                  start={communicationsSearchParamsCache.get("start")}
                  end={communicationsSearchParamsCache.get("end")}
                  search={communicationsSearchParamsCache.get("search")}
                  key={searchParams.key as string}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
}
