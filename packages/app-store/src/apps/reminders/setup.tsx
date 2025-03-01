"use client";

import { ComplexAppSetupProps } from "@vivid/types";
import { ConnectedAppStatusMessage, Form, Skeleton } from "@vivid/ui";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { RemindersApp } from "./app";
import {
  Reminder,
  RemindersConfiguration,
  remindersConfigurationSchema,
} from "./models";

import { Accordion, NonSortable, SaveButton } from "@vivid/ui";
import { v4 } from "uuid";
import { useConnectedAppSetup } from "../../hooks/use-connected-app-setup";
import { useDemoArguments } from "../../hooks/use-demo-arguments";
import { ReminderCard } from "./card";

export const RemindersAppSetup: React.FC<ComplexAppSetupProps> = ({
  appId,
}) => {
  const demoArguments = useDemoArguments();
  const { appStatus, form, isLoading, isDataLoading, onSubmit } =
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
          {isDataLoading ? (
            <Skeleton className="w-full h-40" />
          ) : (
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
          )}
        </form>
      </Form>
      {appStatus && <ConnectedAppStatusMessage app={appStatus} />}
    </>
  );
};
