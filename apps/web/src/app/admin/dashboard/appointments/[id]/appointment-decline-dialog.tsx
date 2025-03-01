"use client";

import { AppointmentActionButton } from "@/components/admin/appointments/action-button";
import { Appointment } from "@vivid/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@vivid/ui";
import { CalendarX2 } from "lucide-react";
import { DateTime } from "luxon";
import React from "react";

export const AppointmentDeclineDialog: React.FC<{
  appointment: Appointment;
}> = ({ appointment }) => {
  const [open, setOpen] = React.useState(appointment.status !== "declined");

  const onOpenChange = (open: boolean) => {
    if (!open) {
      location.replace("?");
    }

    setOpen(open);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-2">
            <div>
              Are you sure that you want to decline appointment by{" "}
              <strong>{appointment.fields.name}</strong> for{" "}
              <em>{appointment.option.name}</em> on{" "}
              <span className="underline underline-offset-2">
                {DateTime.fromJSDate(appointment.dateTime).toLocaleString(
                  DateTime.DATETIME_MED_WITH_WEEKDAY
                )}
              </span>
              ?
            </div>
            <div>
              <strong>Note:</strong> This action cannot be undone. This will
              permanently decline this appointment.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <AppointmentActionButton
              variant="destructive"
              _id={appointment._id}
              status="declined"
            >
              <CalendarX2 size={20} />
              Decline
            </AppointmentActionButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
