import { Appointments } from "./appointments";
import { Services } from "@/lib/services";
import { AppointmentChoice, Fields, WithLabelFieldData } from "@/types";

export type BookingProps = {
  className?: string;
};

export const Booking: React.FC<BookingProps> = async ({ className }) => {
  const config = await Services.ConfigurationService().getConfiguration(
    "booking"
  );

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

  return <Appointments options={choices} optionsClassName={className} />;
};
