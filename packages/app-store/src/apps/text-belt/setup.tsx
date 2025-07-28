"use client";

import { useI18n } from "@vivid/i18n";
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
import { TextBeltApp } from "./app";
import { TextBeltConfiguration, textBeltConfigurationSchema } from "./models";

export const TextBeltAppSetup: React.FC<AppSetupProps> = ({
  onSuccess,

  onError,

  appId,
}) => {
  const t = useI18n("apps");
  const { appStatus, form, isLoading, isValid, onSubmit } =
    useConnectedAppSetup<TextBeltConfiguration>({
      appId,
      appName: TextBeltApp.name,
      schema: textBeltConfigurationSchema,
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
              name="apiKey"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    {t("textBelt.form.apiKey.label")}{" "}
                    <InfoTooltip>
                      {t("textBelt.form.apiKey.tooltip")}
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("textBelt.form.apiKey.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="textMessageResponderAppId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    {t("textBelt.form.textMessageResponderAppId.label")}
                    <InfoTooltip>
                      {t("textBelt.form.textMessageResponderAppId.tooltip")}
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <AppSelector
                      scope="text-message-respond"
                      disabled={isLoading}
                      value={field.value}
                      onItemSelect={(value) => field.onChange(value)}
                      allowClear
                    />
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
              <span>{t("textBelt.form.connect")}</span>
              <ConnectedAppNameAndLogo appName={TextBeltApp.name} />
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
