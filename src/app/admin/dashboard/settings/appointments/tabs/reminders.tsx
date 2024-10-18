import { Sortable } from "@/components/ui/sortable";
import { z } from "zod";
import { TabProps } from "./types";
import { useFieldArray } from "react-hook-form";
import React from "react";
import { v4 } from "uuid";
import {
  ReminderCard,
  ReminderSchema,
  reminderSchema,
} from "./cards/reminderCard";
import { Reminder } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const remindersSchema = z.array(reminderSchema).optional();

export const RemindersTab: React.FC<
  TabProps & { demoArguments: Record<string, any> }
> = ({ form, disabled, demoArguments }) => {
  const { fields, append, remove, swap, update, insert } = useFieldArray({
    control: form.control,
    name: "reminders",
  });

  const addNew = () => {
    append({
      id: v4(),
    } as Partial<Reminder> as ReminderSchema);
  };

  const clone = (index: number) => {
    insert(index + 1, {
      ...form.getValues(`reminders.${index}`),
      id: v4(),
    });
  };

  return (
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
