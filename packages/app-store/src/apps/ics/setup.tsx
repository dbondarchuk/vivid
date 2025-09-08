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
  Input,
  Spinner,
} from "@vivid/ui";
import React from "react";
import { useConnectedAppSetup } from "../../hooks/use-connected-app-setup";
import { IcsApp } from "./app";
import { IcsLinkCalendarSource, icsLinkCalendarSourceSchema } from "./models";

export const IcsAppSetup: React.FC<AppSetupProps> = ({
  onSuccess,
  onError,
  appId: existingAppId,
}) => {
  const t = useI18n("apps");
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
                    {t("ics.form.link.label")}{" "}
                    <InfoTooltip>{t("ics.form.link.tooltip")}</InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("ics.form.link.placeholder")}
                      {...field}
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
              <span>{t("ics.form.connect")}</span>
              <ConnectedAppNameAndLogo appName={IcsApp.name} />
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
