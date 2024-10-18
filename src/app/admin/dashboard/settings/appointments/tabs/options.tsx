import { Sortable } from "@/components/ui/sortable";
import { z } from "zod";
import { TabProps } from "./types";
import { useFieldArray } from "react-hook-form";
import React from "react";
import { v4 } from "uuid";
import { OptionCard, OptionSchema, optionSchema } from "./cards/optionsCard";

export const optionsSchema = z
  .array(optionSchema)
  .min(1, "Options are required");

export const OptionsTab: React.FC<TabProps> = ({ form, disabled }) => {
  const { fields, append, remove, swap, update, insert } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const ids = React.useMemo(() => fields.map((x) => x.id), [fields]);

  const sort = (activeId: string, overId: string) => {
    const activeIndex = fields.findIndex((x) => x.id === activeId);
    const overIndex = fields.findIndex((x) => x.id === overId);

    if (activeIndex < 0 || overIndex < 0) return;

    swap(activeIndex, overIndex);
  };

  const addNew = () => {
    append({
      id: v4(),
    } as Partial<OptionSchema> as OptionSchema);
  };

  const clone = (index: number) => {
    insert(index + 1, {
      ...form.getValues(`options.${index}`),
      id: v4(),
    });
  };

  return (
    <Sortable title="Options" ids={ids} onSort={sort} onAdd={addNew}>
      <div className="flex flex-grow flex-col gap-4">
        {fields.map((item, index) => {
          return (
            <OptionCard
              form={form}
              item={item}
              key={item.id}
              name={`options.${index}`}
              disabled={disabled}
              remove={() => remove(index)}
              update={(newValue) => update(index, newValue)}
              clone={() => clone(index)}
            />
          );
        })}
      </div>
    </Sortable>
  );
};
