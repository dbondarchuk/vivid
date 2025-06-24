import {
  allowPromoCodeType,
  BookingConfiguration,
  customTimeSlotSchema,
  Time,
} from "@vivid/types";
import {
  AppSelector,
  BooleanSelect,
  Button,
  Combobox,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  IComboboxItem,
  InfoTooltip,
  Input,
  InputGroup,
  InputGroupInput,
  InputGroupInputClasses,
  InputGroupSuffixClasses,
  InputSuffix,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SimpleTimePicker,
  TagInput,
} from "@vivid/ui";
import {
  formatTime,
  formatTimeLocale,
  is12hourUserTimeFormat,
  parseTime,
} from "@vivid/utils";
import { getTimeZones } from "@vvo/tzdb";
import React from "react";
import { TabProps } from "./types";
import { useI18n } from "@vivid/i18n";

const timeZones = getTimeZones();
const timeZoneValues: IComboboxItem[] = timeZones.map((zone) => ({
  label: `GMT${zone.currentTimeFormat}`,
  shortLabel: `${zone.alternativeName}`,
  value: zone.name,
}));

const TimePickerTag = ({ onAdd }: { onAdd: (value: string) => void }) => {
  const t = useI18n("admin");
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-col gap-2 p-3">
      <SimpleTimePicker
        use12HourFormat={is12hourUserTimeFormat()}
        onChange={(d) => {
          setDate(d);
        }}
        value={date || new Date()}
      />
      <Button
        type="button"
        variant="default"
        className="w-full"
        onClick={() => {
          if (!date) return;
          onAdd(
            formatTime({
              hour: date.getHours(),
              minute: date.getMinutes(),
            } as Time)
          );
        }}
      >
        {t("settings.appointments.form.main.add")}
      </Button>
    </div>
  );
};

export const MainTab: React.FC<TabProps> = ({ form, disabled }) => {
  const t = useI18n("admin");

  const stepLabels: Record<
    Exclude<BookingConfiguration["slotStart"], undefined>,
    string
  > = {
    "every-hour": t("settings.appointments.form.main.stepLabels.everyHour"),
    custom: t("settings.appointments.form.main.stepLabels.custom"),
    5: t("settings.appointments.form.main.stepLabels.five"),
    10: t("settings.appointments.form.main.stepLabels.ten"),
    15: t("settings.appointments.form.main.stepLabels.fifteen"),
    20: t("settings.appointments.form.main.stepLabels.twenty"),
    30: t("settings.appointments.form.main.stepLabels.thirty"),
  };

  return (
    <div className="gap-2 flex flex-col md:grid md:grid-cols-2 md:gap-4 w-full">
      <FormField
        control={form.control}
        name="timeZone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("settings.appointments.form.main.timeZone")}
            </FormLabel>
            <FormControl>
              <Combobox
                className="flex w-full font-normal text-base"
                values={timeZoneValues}
                searchLabel={t(
                  "settings.appointments.form.main.selectTimeZone"
                )}
                disabled={disabled}
                customSearch={(search) =>
                  timeZoneValues.filter(
                    (zone) =>
                      (zone.label as string)
                        .toLocaleLowerCase()
                        .indexOf(search.toLocaleLowerCase()) >= 0
                  )
                }
                value={field.value}
                onItemSelect={(value) => field.onChange(value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="scheduleAppId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("settings.appointments.form.main.scheduleProviderApp")}
              <InfoTooltip>
                <p>
                  {t(
                    "settings.appointments.form.main.scheduleProviderAppTooltip1"
                  )}
                </p>
                <p>
                  {t(
                    "settings.appointments.form.main.scheduleProviderAppTooltip2"
                  )}
                </p>
              </InfoTooltip>
            </FormLabel>
            <FormControl>
              <AppSelector
                scope="schedule"
                allowClear
                disabled={disabled}
                value={field.value}
                onItemSelect={(value) => field.onChange(value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="autoConfirm"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("settings.appointments.form.main.autoConfirmAppointments")}{" "}
              <InfoTooltip>
                <p>
                  {t("settings.appointments.form.main.autoConfirmTooltip1")}
                </p>
                <p>
                  {t("settings.appointments.form.main.autoConfirmTooltip2")}
                </p>
              </InfoTooltip>
            </FormLabel>
            <FormControl>
              <BooleanSelect
                value={field.value}
                onValueChange={field.onChange}
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="allowPromoCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("settings.appointments.form.main.showPromoCodeField")}{" "}
              <InfoTooltip>
                {t("settings.appointments.form.main.showPromoCodeTooltip")}
              </InfoTooltip>
            </FormLabel>
            <FormControl>
              <Combobox
                value={field.value}
                onItemSelect={field.onChange}
                className="w-full"
                values={allowPromoCodeType.map((type) => ({
                  value: type,
                  label: t(`common.labels.allowPromoCodeType.${type}`),
                }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="maxWeeksInFuture"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("settings.appointments.form.main.maxWeeksInFuture")}
              <InfoTooltip>
                <p>
                  {t(
                    "settings.appointments.form.main.maxWeeksInFutureTooltip1"
                  )}
                </p>
                <p>
                  <span className="font-semibold">
                    {t("settings.appointments.form.main.example")}:
                  </span>{" "}
                  {t(
                    "settings.appointments.form.main.maxWeeksInFutureTooltip2"
                  )}
                </p>
                <p>
                  <span className="font-semibold">
                    {t("settings.appointments.form.main.default")}:
                  </span>{" "}
                  {t(
                    "settings.appointments.form.main.maxWeeksInFutureTooltip3"
                  )}
                </p>
              </InfoTooltip>
            </FormLabel>
            <FormControl>
              <InputGroup>
                <InputGroupInput>
                  <Input
                    disabled={disabled}
                    placeholder="4"
                    type="number"
                    className={InputGroupInputClasses()}
                    {...field}
                  />
                </InputGroupInput>
                <InputSuffix className={InputGroupSuffixClasses()}>
                  {t("settings.appointments.form.main.weeks")}
                </InputSuffix>
              </InputGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="breakDuration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("settings.appointments.form.main.minBreakTime")}
              <InfoTooltip>
                <p>
                  {t("settings.appointments.form.main.minBreakTimeTooltip1")}
                </p>
                <p>
                  {t("settings.appointments.form.main.minBreakTimeTooltip2")}
                </p>
                <p>
                  <span className="font-semibold">
                    {t("settings.appointments.form.main.example")}:
                  </span>{" "}
                  {t("settings.appointments.form.main.minBreakTimeTooltip3")}
                </p>
                <p>
                  <span className="font-semibold">
                    {t("settings.appointments.form.main.default")}:
                  </span>{" "}
                  {t("settings.appointments.form.main.minBreakTimeTooltip4")}
                </p>
              </InfoTooltip>
            </FormLabel>
            <FormControl>
              <InputGroup>
                <InputGroupInput>
                  <Input
                    disabled={disabled}
                    placeholder="0"
                    type="number"
                    className={InputGroupInputClasses()}
                    {...field}
                  />
                </InputGroupInput>
                <InputSuffix className={InputGroupSuffixClasses()}>
                  {t("settings.appointments.form.main.minutes")}
                </InputSuffix>
              </InputGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="minHoursBeforeBooking"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("settings.appointments.form.main.minHoursBeforeBooking")}
              <InfoTooltip>
                <p>
                  {t(
                    "settings.appointments.form.main.minHoursBeforeBookingTooltip1"
                  )}
                </p>
                <p>
                  <span className="font-semibold">
                    {t("settings.appointments.form.main.example")}:
                  </span>{" "}
                  {t(
                    "settings.appointments.form.main.minHoursBeforeBookingTooltip2"
                  )}
                </p>
              </InfoTooltip>
            </FormLabel>
            <FormControl>
              <InputGroup>
                <InputGroupInput>
                  <Input
                    disabled={disabled}
                    placeholder="24"
                    type="number"
                    className={InputGroupInputClasses()}
                    {...field}
                  />
                </InputGroupInput>
                <InputSuffix className={InputGroupSuffixClasses()}>
                  {t("settings.appointments.form.main.hours")}
                </InputSuffix>
              </InputGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="slotStart"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("settings.appointments.form.main.allowedSlotStartTimes")}
              <InfoTooltip>
                {t(
                  "settings.appointments.form.main.allowedSlotStartTimesTooltip"
                )}
              </InfoTooltip>
            </FormLabel>
            <FormControl>
              <Select
                value={
                  typeof field.value === "number"
                    ? `${field.value}`
                    : field.value
                }
                onValueChange={(value) => {
                  const val = parseInt(value);
                  field.onChange(isNaN(val) ? value : val);
                  field.onBlur();
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t(
                      "settings.appointments.form.main.selectStep"
                    )}
                  />
                </SelectTrigger>
                <SelectContent side="bottom">
                  {Object.entries(stepLabels).map(([step, label]) => (
                    <SelectItem key={step} value={step}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {form.getValues("slotStart") === "custom" && (
        <FormField
          control={form.control}
          name="customSlotTimes"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                {t("settings.appointments.form.main.customTimeSlots")}
                <InfoTooltip>
                  {t("settings.appointments.form.main.customTimeSlotsTooltip")}
                </InfoTooltip>
              </FormLabel>
              <FormControl>
                <TagInput
                  {...field}
                  readOnly
                  placeholder={t(
                    "settings.appointments.form.main.customTimeSlotsPlaceholder"
                  )}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    field.onBlur();
                  }}
                  tagValidator={customTimeSlotSchema}
                  tagDisplayTransform={(time) =>
                    formatTimeLocale(parseTime(time))
                  }
                  addItemTemplate={TimePickerTag}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};
