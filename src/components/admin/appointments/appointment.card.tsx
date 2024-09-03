import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import type { Appointment } from "@/types";
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Presentation,
} from "lucide-react";
import { DateTime } from "luxon";
import React from "react";
import { AppointmentActionButton } from "./action.button";
import { StatusText } from "./types";

export type AppointmentCardProps = {
  appointment: Appointment;
};

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>
          <Link
            variant="dashed"
            className="font-medium text-lg"
            href={`/admin/dashboard/customer?email=${appointment.fields.email}`}
          >
            {appointment.fields.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="grid grid-cols-2 gap-y-2">
          <div className="flex flex-row gap-2 font-medium">
            <Presentation /> Appointment:
          </div>
          <div>{appointment.option.name}</div>
          <div className="flex flex-row gap-2 font-medium">
            <CheckCircle /> Status:
          </div>
          <div>{StatusText[appointment.status]}</div>
          <div className="flex flex-row gap-2 font-medium">
            <Calendar /> Date & Time:
          </div>
          <div>
            {DateTime.fromJSDate(appointment.dateTime, {
              zone: "local",
            }).toLocaleString(DateTime.DATETIME_SHORT)}
          </div>
          <div className="flex flex-row gap-2 font-medium">
            <Clock /> Duration:
          </div>
          <div>{appointment.totalDuration} minutes</div>
          {appointment.totalPrice && (
            <>
              <div className="flex flex-row gap-2 font-medium">
                <DollarSign /> Price:
              </div>
              <div>${appointment.totalPrice}</div>
            </>
          )}
        </div>
      </CardContent>
      {appointment.status !== "declined" && (
        <CardFooter className="justify-between">
          {appointment.status === "pending" && (
            <>
              <AppointmentActionButton
                variant="secondary"
                _id={appointment._id}
                status="declined"
              >
                Decline
              </AppointmentActionButton>
              <AppointmentActionButton
                variant="primary"
                _id={appointment._id}
                status="confirmed"
              >
                Accept
              </AppointmentActionButton>
            </>
          )}
          {appointment.status === "confirmed" && (
            <AppointmentActionButton
              variant="secondary"
              _id={appointment._id}
              status="declined"
            >
              Decline
            </AppointmentActionButton>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
