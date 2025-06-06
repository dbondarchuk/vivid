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
  Spinner,
  TemplateSelector,
} from "@vivid/ui";
import React from "react";
import { useConnectedAppSetup } from "../../hooks/use-connected-app-setup";
import { TextMessageAutoReplyApp } from "./app";
import {
  TextMessageAutoReplyConfiguration,
  textMessageAutoReplyConfigurationSchema,
} from "./models";

export const TextMessageAutoReplyAppSetup: React.FC<AppSetupProps> = ({
  onSuccess,

  onError,

  appId,
}) => {
  const { appStatus, form, isLoading, isValid, onSubmit } =
    useConnectedAppSetup<TextMessageAutoReplyConfiguration>({
      appId,
      appName: TextMessageAutoReplyApp.name,
      schema: textMessageAutoReplyConfigurationSchema,
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
              name="autoReplyTemplateId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Auto reply template
                    <InfoTooltip>
                      <p>The template that will be used to send reply.</p>
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <TemplateSelector
                      type="text-message"
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
              <span>Connect with</span>
              <ConnectedAppNameAndLogo
                app={{ name: TextMessageAutoReplyApp.name }}
              />
            </Button>
          </div>
        </form>
      </Form>
      {appStatus && <ConnectedAppStatusMessage app={appStatus} />}
    </>
  );
};
