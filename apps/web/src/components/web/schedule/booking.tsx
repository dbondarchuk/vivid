import { ServicesContainer } from "@vivid/services";
import { AppointmentChoice, FieldSchema } from "@vivid/types";
import { Appointments } from "./appointments";

export type BookingProps = {
  className?: string;
  successPage?: string;
};

export const Booking: React.FC<BookingProps> = async ({
  className,
  successPage,
}) => {
  const { timeZone } =
    await ServicesContainer.ConfigurationService().getConfiguration("general");

  const config =
    await ServicesContainer.ConfigurationService().getConfiguration("booking");

  const [fields, addons, options] = await Promise.all([
    ServicesContainer.ServicesService().getFields({}),
    ServicesContainer.ServicesService().getAddons({}),
    ServicesContainer.ServicesService().getOptions({}),
  ]);

  const configFields = (fields?.items || []).reduce(
    (map, field) => ({
      ...map,
      [field._id]: field,
    }),
    {} as Record<string, FieldSchema>
  );

  const optionsChoices = (config.options || [])
    .map((o) => options.items?.find(({ _id }) => o.id == _id))
    .filter((o) => !!o);

  const choices: AppointmentChoice[] = optionsChoices.map((option) => {
    const addonsFiltered =
      option.addons
        ?.map((o) => addons.items?.find((x) => x._id === o.id))
        .filter((f) => !!f) || [];

    const optionFields = option.fields || [];

    const fieldsIdsRequired = [...optionFields].reduce(
      (map, field) => ({
        ...map,
        [field.id]: !!map[field.id] || !!field.required,
      }),
      {} as Record<string, boolean>
    );

    const fields = Object.entries(fieldsIdsRequired)
      .filter(([id]) => !!configFields[id])
      .map(([id, required]) => ({
        ...configFields[id],
        required: !!configFields[id].required || required,
        id: id,
      }));

    return {
      ...option,
      addons: addonsFiltered,
      fields,
    };
  });

  let showPromoCode = false;
  if (config.allowPromoCode === "always") showPromoCode = true;
  else if (config.allowPromoCode === "allow-if-has-active") {
    const hasActiveDiscounts =
      await ServicesContainer.ServicesService().hasActiveDiscounts(new Date());
    if (hasActiveDiscounts) showPromoCode = true;
  }

  return (
    <Appointments
      options={choices}
      optionsClassName={className}
      successPage={successPage}
      fieldsSchema={configFields}
      timeZone={timeZone}
      showPromoCode={showPromoCode}
    />
  );
};
