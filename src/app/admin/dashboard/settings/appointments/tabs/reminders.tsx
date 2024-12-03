import { Sortable } from "@/components/ui/sortable";
import { z } from "zod";
import { TabProps } from "./types";
import { useFieldArray } from "react-hook-form";
import React from "react";
import { v4 } from "uuid";
import { ReminderCard } from "./cards/reminderCard";
import { Reminder } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { NonSortable } from "@/components/ui/nonSortable";

export const RemindersTab: React.FC<
  TabProps & { demoArguments: Record<string, any> }
> = ({ form, disabled, demoArguments }) => {
  const { fields, append, remove, swap, update, insert } = useFieldArray({
    control: form.control,
    name: "reminders",
    keyName: "fields_id",
  });

  const ids = React.useMemo(() => fields.map((x) => x.id), [fields]);
  const [opened, setOpened] = React.useState<string[]>(ids);

  const addNew = () => {
    const newId = v4();
    append({
      id: newId,
    } as Partial<Reminder> as Reminder);

    setOpened([...opened, newId]);
  };

  const clone = (index: number) => {
    const newId = v4();
    insert(index + 1, {
      ...form.getValues(`reminders.${index}`),
      id: newId,
    });

    setOpened([...opened, newId]);
  };

  const collapse = () => {
    setOpened(opened.length > 0 ? [] : ids);
  };

  return (
    <NonSortable
      title="Reminders"
      ids={ids}
      onAdd={addNew}
      collapse={collapse}
      allCollapsed={opened.length === 0 && ids.length > 0}
    >
      <Accordion type="multiple" value={opened} onValueChange={setOpened}>
        <div className="flex flex-grow flex-col gap-4">
          {fields.map((item, index) => {
            return (
              <ReminderCard
                form={form}
                item={item}
                key={item.id}
                name={`reminders.${index}`}
                disabled={disabled}
                remove={() => remove(index)}
                clone={() => clone(index)}
                update={(newValue) => update(index, newValue)}
                demoArguments={demoArguments}
              />
            );
          })}
        </div>
      </Accordion>
    </NonSortable>
  );
};
