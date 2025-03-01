import { AppointmentCard } from "@/components/admin/appointments/appointment-card";
import { ServicesContainer } from "@vivid/services";
import { Card, CardContent, CardHeader } from "@vivid/ui";
import { DateTime } from "luxon";
import React from "react";

export const PendingAppointmentsTab: React.FC = async () => {
  const beforeNow = DateTime.now().minus({ hours: 1 }).toJSDate();
  const pendingAppointments =
    await ServicesContainer.EventsService().getPendingAppointments(
      20,
      beforeNow
    );

  return (
    <>
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
            <AppointmentCard key={appointment._id} appointment={appointment} />
          ))}
        </div>
      )}
    </>
  );
};
