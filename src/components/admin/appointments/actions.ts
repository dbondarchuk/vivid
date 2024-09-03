"use server";

import { Services } from "@/lib/services";
import { AppointmentStatus } from "@/types";
import { redirect } from "next/navigation";

export async function changeAppointmentStatus(
  id: string,
  newStatus: AppointmentStatus
) {
  await Services.EventsService().changeAppointmentStatus(id, newStatus);
  redirect("/admin/dashboard?activeTab=appointments");
}
