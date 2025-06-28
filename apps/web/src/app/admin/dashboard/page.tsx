import PageContainer from "@/components/admin/layout/page-container";
import { ServicesContainer } from "@vivid/services";
import {
  Breadcrumbs,
  Skeleton,
  TabsContent,
  TabsLinkTrigger,
  TabsList,
  TabsViaUrl,
} from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import { Suspense } from "react";
import { EventsCalendar } from "./events-calendar";
import { NextAppointmentsCards } from "./next-appointments-cards";
import { PendingAppointmentsTab } from "./pending-appointments-tab";
import { PendingAppointmentsBadge } from "./pending-appointments-toast-stream";
import { getI18nAsync } from "@vivid/i18n/server";

type Params = {
  searchParams: Promise<{ activeTab?: string; key?: string }>;
};

const defaultTab = "overview";

export default async function Page({ searchParams }: Params) {
  const logger = getLoggerFactory("AdminPages")("dashboard");
  const { activeTab = defaultTab, key } = await searchParams;
  const t = await getI18nAsync("admin");
  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
  ];

  logger.debug(
    {
      activeTab,
      key,
    },
    "Loading dashboard page"
  );

  return (
    <PageContainer scrollable={true}>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="space-y-2 flex-1">
        <div className="flex items-center justify-between space-y-2">
          <Suspense fallback={<Skeleton className="w-32 h-10" />}>
            <h2 className="text-2xl font-bold tracking-tight">
              {
                (
                  await ServicesContainer.ConfigurationService().getConfiguration(
                    "general"
                  )
                ).name
              }
            </h2>
          </Suspense>
        </div>
        <Suspense>
          <TabsViaUrl defaultValue={defaultTab} className="space-y-4">
            <TabsList className="w-full">
              <TabsLinkTrigger value="overview">
                {t("dashboard.tabs.overview")}
              </TabsLinkTrigger>
              <TabsLinkTrigger value="appointments">
                {t("dashboard.tabs.pendingAppointments")}{" "}
                <PendingAppointmentsBadge />
              </TabsLinkTrigger>
            </TabsList>
            {activeTab === "overview" && (
              <TabsContent
                value="overview"
                className="space-y-4 @container [contain:layout]"
              >
                <div className="flex flex-col-reverse @6xl:flex-row gap-8">
                  <div className="flex flex-col @6xl:basis-2/3 flex-shrink">
                    <EventsCalendar />
                  </div>
                  <div className="@lg:basis-1/3 flex flex-col gap-2 ">
                    <h2 className="tracking-tight text-lg font-medium">
                      {t("dashboard.appointments.nextAppointments")}
                    </h2>
                    <Suspense
                      key={key}
                      fallback={
                        <>
                          {Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton className="w-full h-72" key={index} />
                          ))}
                        </>
                      }
                    >
                      <NextAppointmentsCards />
                    </Suspense>
                  </div>
                </div>
              </TabsContent>
            )}
            {activeTab === "appointments" && (
              <TabsContent value="appointments" className="space-y-4 flex-1">
                <Suspense
                  key={key}
                  fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton className="w-full h-72" key={index} />
                      ))}
                    </div>
                  }
                >
                  <PendingAppointmentsTab />
                </Suspense>
              </TabsContent>
            )}
          </TabsViaUrl>
        </Suspense>
      </div>
    </PageContainer>
  );
}
