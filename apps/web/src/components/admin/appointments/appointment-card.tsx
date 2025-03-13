import { durationToTime } from "@vivid/utils";
import type { Appointment } from "@vivid/types";
import { StatusText } from "@vivid/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Heading,
  Link,
} from "@vivid/ui";
import {
  Calendar,
  CalendarCheck2,
  CalendarX2,
  CheckCircle,
  Clock,
  DollarSign,
  Presentation,
  SquareArrowOutUpRight,
  StickyNote,
} from "lucide-react";
import { DateTime } from "luxon";
import React from "react";
import { AppointmentActionButton } from "./action-button";

export type AppointmentCardProps = {
  appointment: Appointment;
};

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
}) => {
  const duration = durationToTime(appointment.totalDuration);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="w-full flex flex-row justify-between items-center">
          <Heading
            title={appointment.option.name}
            description={`By ${appointment.fields.name}`}
            href={`/admin/dashboard/appointments/${appointment._id}`}
          />
          {/* <Link
            variant="ghost"
            title="View full appointment information"
            href={`/admin/dashboard/appointments/${appointment._id}`}
          >
            <SquareArrowOutUpRight size={20} />
          </Link> */}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm flex flex-col w-full @container">
        <dl className="divide-y">
          <div className="py-1 flex flex-row gap-2 flex-wrap @sm:py-2 @sm:grid @sm:grid-cols-3 @sm:gap-4">
            <dt className="flex self-center items-center gap-1">
              <Presentation size={16} /> Appointment:
            </dt>
            <dd className="col-span-2">{appointment.option.name}</dd>
          </div>
          <div className="py-1 flex flex-row gap-2 flex-wrap @sm:py-2 @sm:grid @sm:grid-cols-3 @sm:gap-4">
            <dt className="flex self-center items-center gap-1">
              <CheckCircle size={16} /> Status:
            </dt>
            <dd className="col-span-2">{StatusText[appointment.status]}</dd>
          </div>
          <div className="py-1 flex flex-row gap-2 flex-wrap @sm:py-2 @sm:grid @sm:grid-cols-3 @sm:gap-4">
            <dt className="flex self-center items-center gap-1">
              <Calendar size={16} /> Date &amp; Time:
            </dt>
            <dd className="col-span-2">
              {DateTime.fromJSDate(appointment.dateTime, {
                zone: "local",
              }).toLocaleString(DateTime.DATETIME_SHORT)}
            </dd>
          </div>
          <div className="py-1 flex flex-row gap-2 flex-wrap @sm:py-2 @sm:grid @sm:grid-cols-3 @sm:gap-4">
            <dt className="flex self-center items-center gap-1">
              <Clock size={16} /> Duration:
            </dt>
            <dd className="col-span-2">
              {duration.hours > 0 && <>{duration.hours} hours</>}
              {duration.hours > 0 && duration.minutes > 0 && <> </>}
              {duration.minutes > 0 && <>{duration.minutes} minutes</>}
            </dd>
          </div>
          <div className="py-1 flex flex-row gap-2 flex-wrap @sm:py-2 @sm:grid @sm:grid-cols-3 @sm:gap-4">
            <dt className="flex self-center items-center gap-1">
              <Calendar size={16} /> Ends at:
            </dt>
            <dd className="col-span-2">
              {DateTime.fromJSDate(appointment.dateTime, {
                zone: "local",
              })
                .plus({ minutes: appointment.totalDuration })
                .toLocaleString(DateTime.DATETIME_SHORT)}
            </dd>
          </div>
          {appointment.totalPrice && (
            <div className="py-1 flex flex-row gap-2 flex-wrap @sm:py-2 @sm:grid @sm:grid-cols-3 @sm:gap-4">
              <dt className="flex self-center items-center gap-1">
                <DollarSign size={16} /> Price:
              </dt>
              <dd className="col-span-2">${appointment.totalPrice}</dd>
            </div>
          )}
          {appointment.note && (
            <div className="py-1 flex flex-row gap-2 flex-wrap @sm:py-2 @sm:grid @sm:grid-cols-3 @sm:gap-4">
              <dt className="flex self-center items-center gap-1">
                <StickyNote size={16} /> Note:
              </dt>
              <dd className="col-span-2">{appointment.note}</dd>
            </div>
          )}
        </dl>
      </CardContent>
      {appointment.status !== "declined" && (
        <CardFooter className="justify-end gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="inline-flex flex-row gap-2 items-center"
              >
                <CalendarX2 size={20} /> Decline
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently decline
                  this appointment.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <AppointmentActionButton
                    variant="secondary"
                    _id={appointment._id}
                    status="declined"
                  >
                    <CalendarX2 size={20} /> Decline
                  </AppointmentActionButton>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {appointment.status === "pending" && (
            <AppointmentActionButton
              variant="default"
              _id={appointment._id}
              status="confirmed"
            >
              <CalendarCheck2 size={20} />
              Confirm
            </AppointmentActionButton>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
