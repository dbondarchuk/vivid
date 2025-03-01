"use client";

import { AppSetupProps } from "@vivid/types";
import {
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
  PhoneInput,
  Spinner,
} from "@vivid/ui";
import React from "react";
import { useConnectedAppSetup } from "../../hooks/use-connected-app-setup";
import { TextMessageNotificationApp } from "./app";
import {
  TextMessageNotificationConfiguration,
  textMessageNotificationConfigurationSchema,
} from "./models";

export const TextMessageNotificationAppSetup: React.FC<AppSetupProps> = ({
  onSuccess,
  onError,
  appId,
}) => {
  const { appStatus, form, isLoading, isValid, onSubmit } =
    useConnectedAppSetup<TextMessageNotificationConfiguration>({
      appId,
      appName: TextMessageNotificationApp.name,
      schema: textMessageNotificationConfigurationSchema,
      onSuccess,
      onError,
    });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col items-center gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Phone number
                    <InfoTooltip>
                      <p>
                        Optional phone number override to use for notifications.
                      </p>
                      <p>Your phone is used by default</p>
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <PhoneInput {...field} label="Phone" />
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
              <span>{isLoading ? "Update" : "Add"}</span>
              <ConnectedAppNameAndLogo
                app={{ name: TextMessageNotificationApp.name }}
              />
            </Button>
          </div>
        </form>
      </Form>
      {appStatus && <ConnectedAppStatusMessage app={appStatus} />}
    </>
  );
};
