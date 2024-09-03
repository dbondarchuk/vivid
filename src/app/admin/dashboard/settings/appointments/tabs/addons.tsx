import { Sortable } from "@/components/ui/sortable";
import { z } from "zod";
import { TabProps } from "./types";
import { useFieldArray } from "react-hook-form";
import React from "react";
import { v4 } from "uuid";
import { AddonCard, AddonSchema, addonSchema } from "./cards/addonCard";

export const addonsSchema = z.array(addonSchema).optional();

export const AddonsTab: React.FC<TabProps> = ({ form, disabled }) => {
  const { fields, append, remove, swap, update } = useFieldArray({
    control: form.control,
    name: "addons",
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
    } as Partial<AddonSchema> as AddonSchema);
  };

  return (
    <Sortable title="Addons" ids={ids} onSort={sort} onAdd={addNew}>
      <div className="flex flex-grow flex-col gap-4">
        {fields.map((item, index) => {
          return (
            <AddonCard
              form={form}
              item={item}
              key={item.id}
              name={`addons.${index}`}
              disabled={disabled}
              remove={() => remove(index)}
              update={(newValue) => update(index, newValue)}
            />
          );
        })}
      </div>
    </Sortable>
  );
};
