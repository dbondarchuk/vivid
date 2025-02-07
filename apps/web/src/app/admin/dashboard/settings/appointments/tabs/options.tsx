import { AppointmentOption } from "@vivid/types";
import { Accordion, Sortable } from "@vivid/ui";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { v4 } from "uuid";
import { OptionCard } from "./cards/optionCard";
import { TabProps } from "./types";

export const OptionsTab: React.FC<TabProps> = ({ form, disabled }) => {
  const { fields, append, remove, swap, update, insert } = useFieldArray({
    control: form.control,
    name: "options",
    keyName: "fields_id",
  });

  const ids = React.useMemo(() => fields.map((x) => x.id), [fields]);
  const [opened, setOpened] = React.useState<string[]>([]);

  const sort = (activeId: string, overId: string) => {
    const activeIndex = fields.findIndex((x) => x.id === activeId);
    const overIndex = fields.findIndex((x) => x.id === overId);

    if (activeIndex < 0 || overIndex < 0) return;

    swap(activeIndex, overIndex);
  };

  const addNew = () => {
    const newId = v4();
    append({
      id: newId,
    } as Partial<AppointmentOption> as AppointmentOption);

    setOpened([...opened, newId]);
  };

  const clone = (index: number) => {
    const newId = v4();
    insert(index + 1, {
      ...form.getValues(`options.${index}`),
      id: newId,
    });

    setOpened([...opened, newId]);
  };

  const collapse = () => {
    setOpened(opened.length > 0 ? [] : ids);
  };

  return (
    <Sortable
      title="Options"
      ids={ids}
      onSort={sort}
      onAdd={addNew}
      collapse={collapse}
      allCollapsed={opened.length === 0 && ids.length > 0}
    >
      <Accordion type="multiple" value={opened} onValueChange={setOpened}>
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
      </Accordion>
    </Sortable>
  );
};
