"use client";

import { AppointmentDeclineDialog } from "@/components/admin/appointments/appointment-decline-dialog";
import { Appointment } from "@vivid/types";

export const AppointmentDeclineDialogWrapper: React.FC<{
  appointment: Appointment;
}> = ({ appointment }) => {
  const onClose = () => {
    location.replace("?");
  };

  return (
    <AppointmentDeclineDialog
      appointment={appointment}
      open={appointment.status !== "declined"}
      onClose={onClose}
    />
  );
};
