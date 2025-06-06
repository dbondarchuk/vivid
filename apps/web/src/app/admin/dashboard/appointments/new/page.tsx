import PageContainer from "@/components/admin/layout/page-container";
import { ServicesContainer } from "@vivid/services";
import { AppointmentChoice } from "@vivid/types";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { AppointmentScheduleForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Appointments", link: "/admin/dashboard/appointments" },
  { title: "New", link: "/admin/dashboard/appointments/new" },
];

type Props = {
  searchParams: Promise<{ from?: string; customer?: string }>;
};

export default async function NewAssetsPage(props: Props) {
  const searchParams = await props.searchParams;
  const config =
    await ServicesContainer.ConfigurationService().getConfiguration("booking");
  const [fields, addons, options] = await Promise.all([
    ServicesContainer.ServicesService().getFields({}),
    ServicesContainer.ServicesService().getAddons({}),
    ServicesContainer.ServicesService().getOptions({}),
  ]);

  const optionsChoices = (config.options || [])
    .map((o) => options.items?.find(({ _id }) => o.id == _id))
    .filter((o) => !!o);

  const choices: AppointmentChoice[] = optionsChoices.map((option) => ({
    ...option,
    addons:
      option.addons
        ?.map((f) => addons.items?.find((x) => x._id === f.id))
        .filter((f) => !!f) || [],
  }));

  const from = searchParams?.from
    ? await ServicesContainer.EventsService().getAppointment(searchParams.from)
    : undefined;

  const customer =
    !from && searchParams.customer
      ? await ServicesContainer.CustomersService().getCustomer(
          searchParams.customer
        )
      : undefined;

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title="New appointments"
            description="Schedule a new appointment on behalf of the customer"
          />
          {/* <Separator /> */}
        </div>
        <AppointmentScheduleForm
          timeZone={config.timeZone}
          options={choices}
          knownFields={fields.items || []}
          from={from}
          customer={customer}
        />
      </div>
    </PageContainer>
  );
}
