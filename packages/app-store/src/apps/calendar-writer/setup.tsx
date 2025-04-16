"use client";

import { AppSetupProps } from "@vivid/types";
import {
  AppSelector,
  Button,
  ConnectedAppNameAndLogo,
  ConnectedAppStatusMessage,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InfoTooltip,
  Input,
  Spinner,
} from "@vivid/ui";
import React from "react";
import { useConnectedAppSetup } from "../../hooks/use-connected-app-setup";
import { CalendarWriterApp } from "./app";
import {
  CalendarWriterConfiguration,
  calendarWriterConfigurationSchema,
} from "./models";

export const CalendarWriterAppSetup: React.FC<AppSetupProps> = ({
  onSuccess,
  onError,
  appId: existingAppId,
}) => {
  const { appStatus, form, isLoading, isValid, onSubmit } =
    useConnectedAppSetup<CalendarWriterConfiguration>({
      appId: existingAppId,
      appName: CalendarWriterApp.name,
      schema: calendarWriterConfigurationSchema,
      onSuccess,
      onError,
    });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col items-center gap-4 w-full">
            <FormField
              control={form.control}
              name="appId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Calendar storage
                    <InfoTooltip>
                      Select calendar that you would like to use as target
                      storage for your appointment events.
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <AppSelector
                      disabled={isLoading}
                      className="w-full"
                      scope="calendar-write"
                      value={field.value}
                      onItemSelect={(value) => {
                        field.onChange(value);
                        field.onBlur();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="default"
              disabled={isLoading || !isValid}
              className="inline-flex gap-2 items-center w-full"
            >
              {isLoading && <Spinner />}
              <span>{existingAppId ? "Update" : "Add"}</span>
              <ConnectedAppNameAndLogo app={{ name: CalendarWriterApp.name }} />
            </Button>
          </div>
        </form>
      </Form>
      {appStatus && <ConnectedAppStatusMessage app={appStatus} />}
    </>
  );
};
