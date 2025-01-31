"use client";

import { ComplexAppSetupProps } from "@/types";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { RemindersApp } from "./reminders.app";
import {
  Reminder,
  RemindersConfiguration,
  remindersConfigurationSchema,
} from "./reminders.models";
import { ConnectedAppStatusMessage } from "@/components/admin/apps/connectedAppProperties";

import { NonSortable } from "@/components/ui/nonSortable";
import { Accordion } from "@/components/ui/accordion";
import { ReminderCard } from "./reminder.card";
import { v4 } from "uuid";
import { useConnectedAppSetup } from "@/hooks/useConnectedAppSetup";
import { SaveButton } from "@/components/admin/forms/save-button";
import { useDemoArguments } from "@/hooks/useDemoArguments";

export const RemindersAppSetup: React.FC<ComplexAppSetupProps> = ({
  appId,
}) => {
  const demoArguments = useDemoArguments();
  const { appStatus, form, isLoading, isValid, onSubmit } =
    useConnectedAppSetup<RemindersConfiguration>({
      appId,
      appName: RemindersApp.name,
      schema: remindersConfigurationSchema,
    });

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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col items-center gap-4 w-full">
            <NonSortable
              title="Reminders"
              ids={ids}
              onAdd={addNew}
              collapse={collapse}
              allCollapsed={opened.length === 0 && ids.length > 0}
            >
              <Accordion
                type="multiple"
                value={opened}
                onValueChange={setOpened}
                className="w-full"
              >
                <div className="flex flex-grow flex-col gap-4">
                  {fields.map((item, index) => {
                    return (
                      <ReminderCard
                        form={form}
                        item={item}
                        key={item.id}
                        name={`reminders.${index}`}
                        disabled={isLoading}
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
            <SaveButton
              form={form}
              disabled={isLoading}
              isLoading={isLoading}
            />
          </div>
        </form>
      </Form>
      {appStatus && <ConnectedAppStatusMessage app={appStatus} />}
    </>
  );
};
