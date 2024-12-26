import { AppointmentCard } from "@/components/admin/appointments/appointment.card";
import { WeeklyCalendarWrapper } from "@/components/admin/calendar/weeklyCalendar.wrapper";
import PageContainer from "@/components/admin/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsViaUrl,
} from "@/components/ui/tabs";
import { Services } from "@/lib/services";
import { DateTime } from "luxon";
import { Suspense } from "react";

export default async function Page() {
  const now = DateTime.now();
  const beforeNow = now.minus({ hours: 1 }).toJSDate();
  const pendingAppointments =
    await Services.EventsService().getPendingAppointments(20, beforeNow);

  const nextAppointments = await Services.EventsService().getNextAppointments(
    now.toJSDate(),
    3
  );

  const { name } = await Services.ConfigurationService().getConfiguration(
    "general"
  );

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
        </div>
        <Suspense>
          <TabsViaUrl defaultValue={"overview"} className="space-y-4">
            <TabsList className="w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="appointments">
                Pending Appointments{" "}
                <Badge
                  variant="default"
                  className="ml-1 px-2 scale-75 -translate-y-1"
                >
                  {pendingAppointments.total}
                </Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="flex flex-col-reverse lg:flex-row gap-8">
                <div className="flex flex-col basis-2/3">
                  <WeeklyCalendarWrapper
                    date={DateTime.now().startOf("day").toJSDate()}
                    className="h-[100vh]"
                  />
                </div>
                <div className="basis-1/3 flex flex-col gap-2 ">
                  <h2 className="tracking-tight text-lg font-medium">
                    Next appointments
                  </h2>
                  <div className="flex flex-col gap-2">
                    {!nextAppointments.length && (
                      <Card>
                        <CardContent className="flex justify-center py-4">
                          No appointments are scheduled
                        </CardContent>
                      </Card>
                    )}
                    {nextAppointments.map((appointment) => (
                      <AppointmentCard
                        appointment={appointment}
                        key={appointment._id}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="appointments" className="space-y-4">
              {pendingAppointments.total === 0 ? (
                <Card>
                  <CardHeader className="flex text-center font-medium text-lg">
                    No pending appointments
                  </CardHeader>
                  <CardContent className="flex justify-center py-4">
                    You&apos;ve caught up on all requests. Good job!
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {pendingAppointments.items.map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </TabsViaUrl>
        </Suspense>
      </div>
    </PageContainer>
  );
}
