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
import { TabProps } from "./types";
import { OptionSelector } from "./cards/option-selector";

export const SmartScheduleTab: React.FC<TabProps> = ({ form, disabled }) => {
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
              Enable SmartSchedule{" "}
              <InfoTooltip>
                Enables more sophisticated features for finding time slots and
                maximizing bookings
              </InfoTooltip>
            </FormLabel>
            <FormControl>
              <BooleanSelect
                value={field.value}
                onValueChange={field.onChange}
                className="w-full"
                trueLabel="Enable"
                falseLabel="Disable"
              />
            </FormControl>
            <FormDescription className="text-destructive font-semibold">
              Attention! This is highly experimental feature that may cause
              unexpected behavior during appointment booking.
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
                  Allow skipping break{" "}
                  <InfoTooltip>
                    Allows skipping break when no other has been found
                  </InfoTooltip>
                </FormLabel>
                <FormControl>
                  <BooleanSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-full"
                    trueLabel="Enable"
                    falseLabel="Disable"
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
                  Prefer back-to-back appointments{" "}
                  <InfoTooltip>
                    Will give higher preference for time slots, that will allow
                    back-to-back appointments
                  </InfoTooltip>
                </FormLabel>
                <FormControl>
                  <BooleanSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-full"
                    trueLabel="Enable"
                    falseLabel="Disable"
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
                  Allow smart slot start times{" "}
                  <InfoTooltip>
                    If no allowed slot start times were found, will try to find
                    unconventional time slot
                  </InfoTooltip>
                </FormLabel>
                <FormControl>
                  <BooleanSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-full"
                    trueLabel="Enable"
                    falseLabel="Disable"
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
                  Prefered service{" "}
                  <InfoTooltip>
                    If selected, will prioritize time slots that will produce
                    maximum number of appointments of the selected service
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
