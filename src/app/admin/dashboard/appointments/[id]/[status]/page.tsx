import { Services } from "@/lib/services";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string; status: "confirm" | "decline" }>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  switch (params.status) {
    case "confirm":
      await Services.EventsService().changeAppointmentStatus(
        params.id,
        "confirmed"
      );
      break;

    case "decline":
      await Services.EventsService().changeAppointmentStatus(
        params.id,
        "declined"
      );
      break;
  }

  redirect(`/admin/dashboard/appointments/${params.id}`);
}
