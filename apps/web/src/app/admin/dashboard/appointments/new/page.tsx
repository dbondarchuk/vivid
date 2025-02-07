import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/pageContainer";
import { ServicesContainer } from "@vivid/services";
import { AppointmentChoice } from "@vivid/types";
import { Heading, Separator } from "@vivid/ui";
import { AppointmentScheduleForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Appointments", link: "/admin/dashboard/appointments" },
  { title: "New", link: "/admin/dashboard/appointments/new" },
];

type Props = {
  searchParams: Promise<{ from?: string }>;
};

export default async function NewAssetsPage(props: Props) {
  const searchParams = await props.searchParams;
  const config =
    await ServicesContainer.ConfigurationService().getConfiguration("booking");
  const choices: AppointmentChoice[] = config.options.map((option) => ({
    ...option,
    fields:
      option.fields
        ?.map((f) => config.fields?.find((x) => x.id === f.id))
        .filter((f) => !!f) || [],
    addons:
      option.addons
        ?.map((f) => config.addons?.find((x) => x.id === f.id))
        .filter((f) => !!f) || [],
  }));

  const from = searchParams?.from
    ? await ServicesContainer.EventsService().getAppointment(searchParams.from)
    : undefined;

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title="New appointments"
            description="Schedule a new appointment on behalf of the customer"
          />
          <Separator />
        </div>
        <AppointmentScheduleForm
          timeZone={config.timezone}
          options={choices}
          from={from}
        />
      </div>
    </PageContainer>
  );
}
