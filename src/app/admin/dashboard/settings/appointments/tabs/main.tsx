import {
  InputGroupInputClasses,
  InputGroupSuffixClasses,
} from "@/components/admin/forms/inputGroupClasses";
import { InfoTooltip } from "@/components/admin/tooltip/infoTooltip";
import { Combobox, IComboboxItem } from "@/components/ui/combobox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupInput,
  InputSuffix,
} from "@/components/ui/inputGroup";
import React from "react";
import { TabProps } from "./types";
import { getTimeZones } from "@vvo/tzdb";

const timezones = getTimeZones();
const timezoneValues: IComboboxItem[] = timezones.map((zone) => ({
  label: `GMT${zone.currentTimeFormat}`,
  shortLabel: `${zone.alternativeName}`,
  value: zone.name,
}));

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
        name="slotStartMinuteStep"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Step of the start minute
              <InfoTooltip>
                <p>
                  Defines A number indicating the step for the start minute of a
                  slot.
                </p>
                <p>
                  <span className="font-semibold">Example:</span> If the sumber
                  is set to 15, slots can only begin at XX:00, XX:15, XX:30 or
                  XX:45
                </p>
              </InfoTooltip>
            </FormLabel>
            <FormControl>
              <Input
                disabled={disabled}
                placeholder="0"
                type="number"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
