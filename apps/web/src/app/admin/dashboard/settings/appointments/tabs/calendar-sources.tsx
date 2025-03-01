import { CalendarSourceConfiguration } from "@vivid/types";
import { NonSortable } from "@vivid/ui";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { CalendarSourceCard } from "./cards/calendarSourceCard";
import { TabProps } from "./types";

export const CalendarSourcesTab: React.FC<TabProps> = ({ form, disabled }) => {
  const { fields, append, remove, swap, update, insert } = useFieldArray({
    control: form.control,
    name: "calendarSources",
    keyName: "fields_id",
  });

  const ids = React.useMemo(() => fields.map((x) => x.fields_id), [fields]);

  const addNew = () => {
    append({
      type: "ics",
    } as Partial<CalendarSourceConfiguration> as CalendarSourceConfiguration);
  };

  const clone = (index: number) => {
    insert(index + 1, {
      ...form.getValues(`calendarSources.${index}`),
    });
  };

  return (
    <NonSortable title="Calendar sources" ids={ids} onAdd={addNew}>
      <div className="flex flex-grow flex-col gap-4">
        {fields.map((item, index) => {
          return (
            <CalendarSourceCard
              form={form}
              item={item}
              key={item.fields_id}
              name={`calendarSources.${index}`}
              disabled={disabled}
              remove={() => remove(index)}
              clone={() => clone(index)}
              update={(newValue) => update(index, newValue)}
            />
          );
        })}
      </div>
    </NonSortable>
  );
};
