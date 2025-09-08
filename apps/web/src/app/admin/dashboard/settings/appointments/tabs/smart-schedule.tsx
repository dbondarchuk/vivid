import { useI18n } from "@vivid/i18n";
import {
  BooleanSelect,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InfoTooltip,
} from "@vivid/ui";
import { OptionSelector } from "./cards/option-selector";
import { TabProps } from "./types";

export const SmartScheduleTab: React.FC<TabProps> = ({ form, disabled }) => {
  const t = useI18n("admin");
  const allowSmartSchedule = form.watch("smartSchedule.allowSmartSchedule");
  return (
    <div className="gap-2 flex flex-col md:grid md:grid-cols-2 md:gap-4 w-full">
      {/* <div className="flex flex-col gap-2"> */}
      <FormField
        control={form.control}
        name="smartSchedule.allowSmartSchedule"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t(
                "settings.appointments.form.smartSchedule.enableSmartSchedule",
              )}{" "}
              <InfoTooltip>
                {t(
                  "settings.appointments.form.smartSchedule.enableSmartScheduleTooltip",
                )}
              </InfoTooltip>
            </FormLabel>
            <FormControl>
              <BooleanSelect
                value={field.value}
                onValueChange={field.onChange}
                className="w-full"
                trueLabel={t("settings.appointments.form.smartSchedule.enable")}
                falseLabel={t(
                  "settings.appointments.form.smartSchedule.disable",
                )}
              />
            </FormControl>
            <FormDescription className="text-destructive font-semibold">
              {t(
                "settings.appointments.form.smartSchedule.experimentalWarning",
              )}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      {allowSmartSchedule && (
        <>
          {/* <div className="gap-2 flex flex-col md:grid md:grid-cols-2 md:gap-4 w-full"> */}
          <FormField
            control={form.control}
            name="smartSchedule.allowSkipBreak"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("settings.appointments.form.smartSchedule.allowSkipBreak")}{" "}
                  <InfoTooltip>
                    {t(
                      "settings.appointments.form.smartSchedule.allowSkipBreakTooltip",
                    )}
                  </InfoTooltip>
                </FormLabel>
                <FormControl>
                  <BooleanSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-full"
                    trueLabel={t(
                      "settings.appointments.form.smartSchedule.enable",
                    )}
                    falseLabel={t(
                      "settings.appointments.form.smartSchedule.disable",
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="smartSchedule.preferBackToBack"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t(
                    "settings.appointments.form.smartSchedule.preferBackToBack",
                  )}{" "}
                  <InfoTooltip>
                    {t(
                      "settings.appointments.form.smartSchedule.preferBackToBackTooltip",
                    )}
                  </InfoTooltip>
                </FormLabel>
                <FormControl>
                  <BooleanSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-full"
                    trueLabel={t(
                      "settings.appointments.form.smartSchedule.enable",
                    )}
                    falseLabel={t(
                      "settings.appointments.form.smartSchedule.disable",
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="smartSchedule.allowSmartSlotStarts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t(
                    "settings.appointments.form.smartSchedule.allowSmartSlotStarts",
                  )}{" "}
                  <InfoTooltip>
                    {t(
                      "settings.appointments.form.smartSchedule.allowSmartSlotStartsTooltip",
                    )}
                  </InfoTooltip>
                </FormLabel>
                <FormControl>
                  <BooleanSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-full"
                    trueLabel={t(
                      "settings.appointments.form.smartSchedule.enable",
                    )}
                    falseLabel={t(
                      "settings.appointments.form.smartSchedule.disable",
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="smartSchedule.maximizeForOption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t(
                    "settings.appointments.form.smartSchedule.preferredService",
                  )}{" "}
                  <InfoTooltip>
                    {t(
                      "settings.appointments.form.smartSchedule.preferredServiceTooltip",
                    )}
                  </InfoTooltip>
                </FormLabel>
                <FormControl>
                  <OptionSelector
                    allowClear
                    disabled={disabled}
                    className="flex w-full font-normal text-base"
                    value={field.value}
                    onItemSelect={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* </div> */}
        </>
      )}
    </div>
  );
};
