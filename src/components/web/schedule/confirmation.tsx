import { useI18nAsync } from "@/i18n/i18n";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Timer, DollarSign } from "lucide-react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Services } from "@/lib/services";
import { durationToTime } from "@/lib/time";

export const BookingConfirmation: React.FC = async () => {
  const i18n = await useI18nAsync();

  const appointmentIdCookie = cookies().get("appointment_id");
  if (!appointmentIdCookie || !appointmentIdCookie.value) {
    redirect("/");
  }

  const appointment = await Services.EventsService().getAppointment(
    appointmentIdCookie.value
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
                durationToTime(appointment.totalDuration)
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
