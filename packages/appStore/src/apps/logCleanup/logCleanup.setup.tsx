"use client";

import { AppSetupProps } from "@vivid/types";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@vivid/ui";
import React from "react";
import {
  ConnectedAppNameAndLogo,
  ConnectedAppStatusMessage,
} from "../../ui/connectedAppProperties";
import { LogCleanupApp } from "./logCleanup.app";
import {
  CleanUpIntervalType,
  LogCleanupConfiguration,
  logCleanupConfigurationSchema,
} from "./logCleanup.models";

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from "@vivid/ui";
import { useConnectedAppSetup } from "../../hooks/useConnectedAppSetup";

const intervalTypeLabels: Record<CleanUpIntervalType, string> = {
  days: "Days",
  weeks: "Weeks",
  months: "Months",
};

export const LogCleanupAppSetup: React.FC<AppSetupProps> = ({
  onSuccess,
  onError,
  appId: existingAppId,
}) => {
  const { appStatus, form, isLoading, isValid, onSubmit } =
    useConnectedAppSetup<LogCleanupConfiguration>({
      appId: existingAppId,
      appName: LogCleanupApp.name,
      schema: logCleanupConfigurationSchema,
      onSuccess,
      onError,
    });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-full gap-2 flex flex-col md:grid md:grid-cols-2 md:gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interval amount</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        type="number"
                        placeholder="1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interval type</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isLoading}
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          field.onBlur();
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Interval type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(intervalTypeLabels).map(
                            ([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              variant="default"
              disabled={isLoading || !isValid}
              className="inline-flex gap-2 items-center w-full"
            >
              {isLoading && <Spinner />}
              <span>{existingAppId ? "Update" : "Add"}</span>
              <ConnectedAppNameAndLogo app={{ name: LogCleanupApp.name }} />
            </Button>
          </div>
        </form>
      </Form>
      {appStatus && <ConnectedAppStatusMessage app={appStatus} />}
    </>
  );
};
