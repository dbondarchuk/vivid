import { getI18nAsync } from "@vivid/i18n/server";
import { ServicesContainer } from "@vivid/services";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@vivid/ui";
import { durationToTime } from "@vivid/utils";
import { DollarSign, Timer } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const BookingConfirmation: React.FC = async () => {
  const appointmentIdCookie = (await cookies()).get("appointment_id");
  if (!appointmentIdCookie || !appointmentIdCookie.value) {
    redirect("/");
  }

  const i18n = await getI18nAsync("translation");

  const appointment = await ServicesContainer.EventsService().getAppointment(
    appointmentIdCookie.value,
  );

  if (!appointment) {
    redirect("/");
  }

  return (
    <Card className="sm:min-w-min md:w-full">
      <CardHeader className="text-center">
        <CardTitle>{appointment.option.name}</CardTitle>
        <CardDescription className="flex flex-row gap-2 justify-center place-items-center">
          {appointment.totalDuration && (
            <div className="flex flex-row items-center">
              <Timer className="mr-1" />
              {i18n(
                "duration_hour_min_format",
                durationToTime(appointment.totalDuration),
              )}
            </div>
          )}
          {appointment.totalPrice && (
            <div className="flex flex-row items-center">
              <DollarSign className="mr-1" />
              {appointment.totalPrice.toFixed(2).replace(/\.00$/, "")}
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative text-center">
          <div className="mb-3">
            <h2>{i18n("confirmation_success_title")}</h2>
          </div>
          <div className="flex flex-row gap-2 justify-around flex-wrap">
            {i18n("confirmation_success_message", {
              name: appointment.fields.name,
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
