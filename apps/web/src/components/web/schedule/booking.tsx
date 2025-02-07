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
  const config =
    await ServicesContainer.ConfigurationService().getConfiguration("booking");

  const configFields = (config.fields || []).reduce(
    (map, field) => ({
      ...map,
      [field.id]: field,
    }),
    {} as Record<string, FieldSchema>
  );

  const choices: AppointmentChoice[] = config.options.map((option) => {
    const addons =
      option.addons
        ?.map((f) => config.addons?.find((x) => x.id === f.id))
        .filter((f) => !!f) || [];

    const optionFields = option.fields || [];
    const addonsFields = addons.flatMap((addon) => addon.fields || []);

    const fieldsIdsRequired = [...optionFields, ...addonsFields].reduce(
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
      }));

    return {
      ...option,
      addons,
      fields,
    };
  });

  return (
    <Appointments
      options={choices}
      optionsClassName={className}
      successPage={successPage}
    />
  );
};
