"use client";

import { useI18n } from "@vivid/i18n";
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

  const t = useI18n("apps");

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
                    {t("textMessageNotification.form.phone.label")}
                    <InfoTooltip>
                      {t("textMessageNotification.form.phone.tooltip")}
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <PhoneInput
                      {...field}
                      label={t(
                        "textMessageNotification.form.phone.placeholder"
                      )}
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
              <span>
                {isLoading
                  ? t("textMessageNotification.form.update")
                  : t("textMessageNotification.form.add")}
              </span>
              <ConnectedAppNameAndLogo
                appName={TextMessageNotificationApp.name}
              />
            </Button>
          </div>
        </form>
      </Form>
      {appStatus && (
        <ConnectedAppStatusMessage
          status={appStatus.status}
          statusText={appStatus.statusText}
        />
      )}
    </>
  );
};
