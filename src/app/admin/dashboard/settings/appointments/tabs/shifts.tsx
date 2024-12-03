import { DayScheduleSelector } from "@/components/ui/dayScheduleSelector";
import { TabProps } from "./types";
import { FormField } from "@/components/ui/form";

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
