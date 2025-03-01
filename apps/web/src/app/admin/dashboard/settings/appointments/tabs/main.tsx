import { BookingConfiguration, customTimeSlotSchema, Time } from "@vivid/types";
import {
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

const timezones = getTimeZones();
const timezoneValues: IComboboxItem[] = timezones.map((zone) => ({
  label: `GMT${zone.currentTimeFormat}`,
  shortLabel: `${zone.alternativeName}`,
  value: zone.name,
}));

const stepLabels: Record<
  Exclude<BookingConfiguration["slotStart"], undefined>,
  string
> = {
  "every-hour": "Every hour at XX:00",
  custom: "Custom",
  5: "Every hour at XX:05, XX:10, XX:15, XX:20, XX:25, XX:30, XX:35, XX:40, XX:45, XX:50, XX:55",
  10: "Every hour at XX:00, XX:10, XX:20, XX:30, XX:40, XX:50",
  15: "Every hour at XX:00, XX:15, XX:30, XX:45",
  20: "Every hour at XX:00, XX:20, XX:40",
  30: "Every hour at XX:00, XX:30",
};

const TimePickerTag = ({ onAdd }: { onAdd: (value: string) => void }) => {
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
        Add
      </Button>
    </div>
  );
};

export const MainTab: React.FC<TabProps> = ({ form, disabled }) => {
  return (
    <div className="gap-2 flex flex-col md:grid md:grid-cols-2 md:gap-4">
      <FormField
        control={form.control}
        name="timezone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Time zone</FormLabel>
            <FormControl>
              <Combobox
                className="flex w-full font-normal text-base"
                values={timezoneValues}
                searchLabel="Select timezone"
                disabled={disabled}
                customSearch={(search) =>
                  timezoneValues.filter(
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
        name="maxWeeksInFuture"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Maximum number of weeks into the future
              <InfoTooltip>
                <p>
                  Specifies the maximum number of weeks into the future that a
                  user can schedule appointments.
                </p>
                <p>
                  <span className="font-semibold">Example:</span> If set to 6,
                  users can only schedule events up to 6 weeks from the current
                  date.
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
                  weeks
                </InputSuffix>
              </InputGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="minAvailableTimeBeforeSlot"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Minimum time before a scheduled time slot
              <InfoTooltip>
                <p>
                  Defines the minimum required time interval that must be left
                  available before a scheduled time slot.
                </p>
                <p>
                  This field ensures there is a buffer period before each slot
                  to accommodate breaks, preparation time, or to prevent
                  scheduling conflicts.
                </p>
                <p>
                  <span className="font-semibold">Example:</span> If set to 30,
                  there must be at least 30 minutes of free time before each
                  scheduled slot before the next slot can begin.
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
                  minutes
                </InputSuffix>
              </InputGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="minAvailableTimeAfterSlot"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Minimum time after a scheduled time slot
              <InfoTooltip>
                <p>
                  Defines the minimum required time interval that must be left
                  available after a scheduled time slot.
                </p>
                <p>
                  This field ensures there is a buffer period following each
                  slot to accommodate breaks, preparation time, or to prevent
                  scheduling conflicts.
                </p>
                <p>
                  <span className="font-semibold">Example:</span> If set to 30,
                  there must be at least 30 minutes of free time after each
                  scheduled slot before the next slot can begin.
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
                  minutes
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
              Minimum number of hours before booking
              <InfoTooltip>
                <p>
                  Specifies the minimum number of hours required in advance for
                  a booking to be made. This parameter helps ensure that users
                  cannot book an appointment with less notice than the
                  designated time frame, allowing you to prepare accordingly
                </p>
                <p>
                  <span className="font-semibold">Example:</span> If set to 24,
                  a booking can only be made if it is at least 24 hours before
                  the desired start time.
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
                  hours
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
              Allowed slot start times
              <InfoTooltip>
                Defines at which minute appointments allowed to start
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
                  <SelectValue placeholder="Select step" />
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
            <FormItem>
              <FormLabel>
                Custom time slots
                <InfoTooltip>
                  Defines at which minute appointments allowed to start
                </InfoTooltip>
              </FormLabel>
              <FormControl>
                <TagInput
                  {...field}
                  readOnly
                  placeholder="Click plus button to add time slot"
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
