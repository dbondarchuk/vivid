import PageContainer from "@/components/admin/layout/page-container";
import { getI18nAsync } from "@vivid/i18n/server";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { AppointmentChoice } from "@vivid/types";
import { Breadcrumbs, Heading } from "@vivid/ui";
import { AppointmentScheduleForm } from "./form";

type Props = {
  searchParams: Promise<{ from?: string; customer?: string }>;
};

export default async function NewAssetsPage(props: Props) {
  const t = await getI18nAsync("admin");
  const logger = getLoggerFactory("AdminPages")("new-appointment");
  const searchParams = await props.searchParams;

  logger.debug(
    {
      from: searchParams.from,
      customer: searchParams.customer,
    },
    "Loading new appointment page"
  );

  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    {
      title: t("navigation.appointments"),
      link: "/admin/dashboard/appointments",
    },
    {
      title: t("appointments.new.title"),
      link: "/admin/dashboard/appointments/new",
    },
  ];

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

  logger.debug(
    {
      from: searchParams.from,
      customer: searchParams.customer,
      hasFromAppointment: !!from,
      hasCustomer: !!customer,
      optionsCount: choices.length,
      fieldsCount: fields.items?.length || 0,
      addonsCount: addons.items?.length || 0,
    },
    "New appointment page loaded"
  );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title={t("appointments.new.title")}
            description={t("appointments.new.description")}
          />
        </div>
        <AppointmentScheduleForm
          options={choices}
          knownFields={fields.items || []}
          from={from}
          customer={customer}
        />
      </div>
    </PageContainer>
  );
}
