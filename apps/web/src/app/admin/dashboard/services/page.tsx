import { redirect } from "next/navigation";

export default async function ServicesPage() {
  redirect("/admin/dashboard/services/options");
}
