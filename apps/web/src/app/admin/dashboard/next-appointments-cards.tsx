import { AppointmentCard } from "@/components/admin/appointments/appointment-card";
import { ServicesContainer } from "@vivid/services";
import { Card, CardContent } from "@vivid/ui";
import { DateTime } from "luxon";
import React from "react";

export const NextAppointmentsCards: React.FC = async () => {
  const nextAppointments =
    await ServicesContainer.EventsService().getNextAppointments(
      DateTime.now().toJSDate(),
      3
    );

  const { timezone } =
    await ServicesContainer.ConfigurationService().getConfiguration("booking");

  return (
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
          timezone={timezone}
          key={appointment._id}
        />
      ))}
    </div>
  );
};
