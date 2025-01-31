"use client";

import { AppSetupProps, ConnectedAppStatusWithText } from "@/types";
import React from "react";
import { addNewApp, getAppData, processRequest } from "../apps.actions";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InfoTooltip } from "@/components/admin/tooltip/infoTooltip";
import { TextMessageNotificationApp } from "./textMessageNotification.app";
import {
  TextMessageNotificationConfiguration,
  textMessageNotificationConfigurationSchema,
} from "./textMessageNotification.models";
import {
  ConnectedAppNameAndLogo,
  ConnectedAppStatusMessage,
} from "@/components/admin/apps/connectedAppProperties";
import { PhoneInput } from "@/components/ui/phoneInput";
import { useConnectedAppSetup } from "@/hooks/useConnectedAppSetup";
import { Spinner } from "@/components/ui/spinner";

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
                    <PhoneInput {...field} />
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
