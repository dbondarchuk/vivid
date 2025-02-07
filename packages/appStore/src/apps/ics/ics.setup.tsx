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
  InfoTooltip,
  Input,
  Spinner,
} from "@vivid/ui";
import React from "react";
import { useConnectedAppSetup } from "../../hooks/useConnectedAppSetup";
import {
  ConnectedAppNameAndLogo,
  ConnectedAppStatusMessage,
} from "../../ui/connectedAppProperties";
import { IcsApp } from "./ics.app";
import {
  IcsLinkCalendarSource,
  icsLinkCalendarSourceSchema,
} from "./ics.models";

export const IcsAppSetup: React.FC<AppSetupProps> = ({
  onSuccess,
  onError,
  appId: existingAppId,
}) => {
  const { appStatus, form, isLoading, isValid, onSubmit } =
    useConnectedAppSetup<IcsLinkCalendarSource>({
      appId: existingAppId,
      appName: IcsApp.name,
      schema: icsLinkCalendarSourceSchema,
      onSuccess,
      onError,
    });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col items-center gap-2">
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    ICS link <InfoTooltip>URL to ICS calendar</InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading || !isValid}
              type="submit"
              variant="default"
              className="inline-flex gap-2 items-center w-full"
            >
              {isLoading && <Spinner />}
              <span>Connect with</span>
              <ConnectedAppNameAndLogo app={{ name: IcsApp.name }} />
            </Button>
          </div>
        </form>
      </Form>
      {appStatus && <ConnectedAppStatusMessage app={appStatus} />}
    </>
  );
};
