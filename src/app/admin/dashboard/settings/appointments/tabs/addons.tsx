import { z } from "zod";
import { TabProps } from "./types";
import { useFieldArray } from "react-hook-form";
import React from "react";
import { v4 } from "uuid";
import { AddonCard, AddonSchema, addonSchema } from "./cards/addonCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const addonsSchema = z.array(addonSchema).optional();

export const AddonsTab: React.FC<TabProps> = ({ form, disabled }) => {
  const { fields, append, remove, swap, update, insert } = useFieldArray({
    control: form.control,
    name: "addons",
    keyName: "fields_id",
  });

  const addNew = () => {
    append({
      id: v4(),
    } as Partial<AddonSchema> as AddonSchema);
  };

  const clone = (index: number) => {
    insert(index + 1, {
      ...form.getValues(`addons.${index}`),
      id: v4(),
    });
  };

  return (
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
            clone={() => clone(index)}
          />
        );
      })}
      <Button
        className="w-full inline-flex items-center gap-1"
        variant="default"
        onClick={addNew}
      >
        <Plus size={20} /> Add new
      </Button>
    </div>
  );
};
