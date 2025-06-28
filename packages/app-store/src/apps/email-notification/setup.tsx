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
  Input,
  Spinner,
} from "@vivid/ui";
import React from "react";
import { useI18n } from "@vivid/i18n";
import { useConnectedAppSetup } from "../../hooks/use-connected-app-setup";
import { EmailNotificationApp } from "./app";
import {
  EmailNotificationConfiguration,
  emailNotificationConfigurationSchema,
} from "./models";

export const EmailNotificationAppSetup: React.FC<AppSetupProps> = ({
  onSuccess,
  onError,
  appId: existingAppId,
}) => {
  const { appStatus, form, isLoading, isValid, onSubmit } =
    useConnectedAppSetup<EmailNotificationConfiguration>({
      appId: existingAppId,
      appName: EmailNotificationApp.name,
      schema: emailNotificationConfigurationSchema,
      onSuccess,
      onError,
    });

  const t = useI18n("apps");

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col items-center gap-4 w-full">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    {t("emailNotification.form.email.label")}
                    <InfoTooltip>
                      {t("emailNotification.form.email.tooltip")}
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      type="email"
                      placeholder={t(
                        "emailNotification.form.email.placeholder"
                      )}
                      {...field}
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
                {existingAppId
                  ? t("emailNotification.form.update")
                  : t("emailNotification.form.add")}
              </span>
              <ConnectedAppNameAndLogo
                app={{ name: EmailNotificationApp.name }}
                t={t}
              />
            </Button>
          </div>
        </form>
      </Form>
      {appStatus && <ConnectedAppStatusMessage app={appStatus} t={t} />}
    </>
  );
};
