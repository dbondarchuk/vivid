import { ServicesContainer } from "@vivid/services";
import { getLoggerFactory } from "@vivid/logger";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string; status: "confirm" | "decline" }>;
};

export default async function Page(props: Props) {
  const logger = getLoggerFactory("AdminPages")("appointment-status-change");
  const params = await props.params;

  logger.debug(
    {
      appointmentId: params.id,
      status: params.status,
    },
    "Processing appointment status change"
  );

  switch (params.status) {
    case "confirm":
      await ServicesContainer.EventsService().changeAppointmentStatus(
        params.id,
        "confirmed"
      );

      logger.debug(
        {
          appointmentId: params.id,
          newStatus: "confirmed",
        },
        "Appointment confirmed, redirecting"
      );

      redirect(`/admin/dashboard/appointments/${params.id}`);

    case "decline":
      // await ServicesContainer.EventsService().changeAppointmentStatus(
      //   params.id,
      //   "declined"
      // );

      logger.debug(
        {
          appointmentId: params.id,
          action: "decline",
        },
        "Appointment decline requested, redirecting with decline modal"
      );

      redirect(`/admin/dashboard/appointments/${params.id}?decline`);
  }
}
