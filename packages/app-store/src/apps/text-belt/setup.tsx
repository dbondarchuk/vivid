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
import { TextBeltApp } from "./app";
import { TextBeltConfiguration, textBeltConfigurationSchema } from "./models";

export const TextBeltAppSetup: React.FC<AppSetupProps> = ({
  onSuccess,

  onError,

  appId,
}) => {
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
                    API key <InfoTooltip>TextBelt auth token</InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="API key" {...field} />
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
                    Fallback text message responder
                    <InfoTooltip>
                      <p>
                        If not handled by sender, it will be used as default app
                        to respond to text messages (i.e. auto reply)
                      </p>
                      <p>Optional</p>
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
              <span>Connect with</span>
              <ConnectedAppNameAndLogo app={{ name: TextBeltApp.name }} />
            </Button>
          </div>
        </form>
      </Form>
      {appStatus && <ConnectedAppStatusMessage app={appStatus} />}
    </>
  );
};
