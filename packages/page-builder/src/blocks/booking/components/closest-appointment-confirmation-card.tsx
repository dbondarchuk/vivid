import { useI18n } from "@vivid/i18n";
import { Checkbox, Label, Markdown } from "@vivid/ui";
import { template } from "@vivid/utils";
import { DateTime } from "luxon";
import { useScheduleContext } from "./context";

export const ClosestAppointmentConfirmationCard: React.FC = () => {
  const i18n = useI18n("translation");
  const {
    closestAppointment,
    fields,
    appointmentOption,
    confirmClosestAppointment,
    setConfirmClosestAppointment,
  } = useScheduleContext();

  if (
    !appointmentOption.askForConfirmationIfHasCloseAppointments?.enabled ||
    !closestAppointment
  ) {
    return null;
  }

  return (
    <div className="relative">
      <div className="mb-3 text-center">
        <h2>{i18n("closest_appointment_confirmation_title")}</h2>
      </div>
      <div className="flex flex-col gap-4 flex-wrap">
        <Markdown
          markdown={template(
            appointmentOption.askForConfirmationIfHasCloseAppointments.message,
            {
              date: closestAppointment.toLocaleString(DateTime.DATE_HUGE),
              name: fields.name,
              service: appointmentOption.name,
            },
          )}
          prose="simple"
        />
        <Label className="flex flex-row gap-2 items-center text-base">
          <Checkbox
            checked={confirmClosestAppointment}
            onCheckedChange={(e) => setConfirmClosestAppointment(!!e)}
          />
          <div>{i18n("closest_appointment_checkbox_label")}</div>
        </Label>
      </div>
    </div>
  );
};
