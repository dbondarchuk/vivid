import { DayScheduleSelector, FormField } from "@vivid/ui";
import { TabProps } from "./types";

export const ShiftsTab: React.FC<TabProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="workHours"
      render={({ field }) => (
        <DayScheduleSelector value={field.value} onChange={field.onChange} />
      )}
    />
  );
};
