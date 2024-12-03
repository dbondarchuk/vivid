import { z } from "zod";
import { TabProps } from "./types";
import { useFieldArray } from "react-hook-form";
import React from "react";
import { v4 } from "uuid";
import { FieldCard } from "./cards/fieldCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FieldSchema } from "@/types/configuration/booking/field";
import { NonSortable } from "@/components/ui/nonSortable";
import { Accordion } from "@/components/ui/accordion";

export const FieldsTab: React.FC<TabProps> = ({ form, disabled }) => {
  const { fields, append, remove, swap, update, insert } = useFieldArray({
    control: form.control,
    name: "fields",
    keyName: "fields_id",
  });

  const ids = React.useMemo(() => fields.map((x) => x.id), [fields]);
  const [opened, setOpened] = React.useState<string[]>([]);

  const addNew = () => {
    const newId = v4();
    append({
      id: newId,
      required: false,
    } as Partial<FieldSchema> as FieldSchema);

    setOpened([...opened, newId]);
  };

  const clone = (index: number) => {
    const newId = v4();
    insert(index + 1, {
      ...form.getValues(`fields.${index}`),
      id: newId,
    });

    setOpened([...opened, newId]);
  };

  const collapse = () => {
    setOpened(opened.length > 0 ? [] : ids);
  };

  return (
    <NonSortable
      title="Options"
      ids={ids}
      onAdd={addNew}
      collapse={collapse}
      allCollapsed={opened.length === 0 && ids.length > 0}
    >
      <Accordion type="multiple" value={opened} onValueChange={setOpened}>
        <div className="flex flex-grow flex-col gap-4">
          {fields.map((item, index) => {
            return (
              <FieldCard
                form={form}
                item={item}
                key={item.id}
                name={`fields.${index}`}
                disabled={disabled}
                remove={() => remove(index)}
                update={(newValue) => update(index, newValue)}
                clone={() => clone(index)}
              />
            );
          })}
        </div>
      </Accordion>
    </NonSortable>
  );
};
