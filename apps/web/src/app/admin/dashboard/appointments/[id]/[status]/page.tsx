import { ServicesContainer } from "@vivid/services";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string; status: "confirm" | "decline" }>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  switch (params.status) {
    case "confirm":
      await ServicesContainer.EventsService().changeAppointmentStatus(
        params.id,
        "confirmed"
      );

      redirect(`/admin/dashboard/appointments/${params.id}`);

    case "decline":
      // await ServicesContainer.EventsService().changeAppointmentStatus(
      //   params.id,
      //   "declined"
      // );

      redirect(`/admin/dashboard/appointments/${params.id}?decline`);
  }
}
