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
import { TextBeltApp } from "./textBelt.app";
import {
  TextBeltConfiguration,
  textBeltConfigurationSchema,
} from "./textBelt.models";

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
                    API key <InfoTooltip>TextBelt auth tokenr</InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="API key" {...field} />
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
