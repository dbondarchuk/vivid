import { Appointment, BookingConfiguration, FieldType } from "@vivid/types";

export const getPhoneField = (
  appointment: Appointment,
  bookingConfiguration: BookingConfiguration
): string | undefined => {
  const phoneFields =
    bookingConfiguration.fields
      ?.filter((x) => (x.type as any) === FieldType.Phone)
      .map((x) => x.name) || [];

  const fields = new Set(
    ["phone", ...(phoneFields || [])].map((x) => x.toLowerCase())
  );

  const [_, phone] =
    Object.entries(appointment.fields as Record<string, string>).find(
      ([field]) => fields.has(field.toLowerCase())
    ) || [];

  if (!phone) {
    return;
  }

  return phone;
};
