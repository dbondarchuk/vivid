"use client";

import { ComplexAppSetupProps, StatusText } from "@vivid/types";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InfoTooltip,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Textarea,
} from "@vivid/ui";
import { templateSafeWithError } from "@vivid/utils";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ConnectedAppStatusMessage } from "../../ui/connectedAppProperties";
import { CustomerTextMessageNotificationApp } from "./customerTextMessageNotification.app";
import {
  CustomerTextMessageNotificationConfiguration,
  customerTextMessageNotificationConfigurationSchema,
  TextMessagesTemplateKeys,
} from "./customerTextMessageNotification.models";

import { SaveButton } from "@vivid/ui";
import { useConnectedAppSetup } from "../../hooks/useConnectedAppSetup";
import { useDemoArguments } from "../../hooks/useDemoArguments";
import * as templates from "./templates";

const defaultTemplates: Record<TextMessagesTemplateKeys | "autoReply", string> =
  {
    confirmed: templates.appointmentConfirmed,
    declined: templates.appointmentDeclined,
    pending: templates.appointmentCreated,
    rescheduled: templates.appointmentRescheduled,
    autoReply: templates.autoReply,
  };

const templateKeyText: Record<TextMessagesTemplateKeys, string> = {
  ...StatusText,
  rescheduled: "Rescheduled",
};

const TextMessagesTemplateForm: React.FC<{
  form: UseFormReturn<CustomerTextMessageNotificationConfiguration>;
  disabled?: boolean;
  type: TextMessagesTemplateKeys;
  whenText: string;
  demoArguments: Record<string, any>;
}> = ({ form, disabled, type, whenText, demoArguments }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h3 className="m-0 text-center">
        {templateKeyText[type]} Text message template
      </h3>
      <FormField
        control={form.control}
        name={`templates.${type}.body`}
        render={({ field }) => (
          <ResizablePanelGroup direction="horizontal" className="max-md:hidden">
            <ResizablePanel className="pr-4">
              <FormItem>
                <FormLabel className="flex flex-row items-center justify-between">
                  <span>
                    Text message body
                    <InfoTooltip>
                      <p>
                        Body of the text message, that your customers will see
                        when {whenText}
                      </p>
                      <p>
                        Leave empty to not send text message when {whenText}
                      </p>
                      <p>* Uses templated values</p>
                    </InfoTooltip>
                  </span>
                  <Button
                    variant="link"
                    type="button"
                    className="px-0 text-xs text-muted-foreground decoration-dashed underline hover:no-underline"
                    onClick={() => field.onChange(defaultTemplates[type])}
                  >
                    Use default template
                  </Button>
                </FormLabel>
                <FormControl>
                  <Textarea
                    disabled={disabled}
                    placeholder="Body"
                    className="mx-0 focus:mx-1 active:mx-1"
                    autoResize
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {field.value?.length || 0} characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="pl-4">
              <FormItem>
                <FormLabel>Preview</FormLabel>
                <div
                  className="w-full text-sm"
                  dangerouslySetInnerHTML={{
                    __html: templateSafeWithError(
                      field.value || "",
                      demoArguments
                    ).replaceAll("\n", "<br/>"),
                  }}
                />
              </FormItem>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      />
    </div>
  );
};

export const CustomerTextMessageNotificationAppSetup: React.FC<
  ComplexAppSetupProps
> = ({ appId }) => {
  const demoArguments = useDemoArguments();
  const { appStatus, form, isLoading, isValid, onSubmit } =
    useConnectedAppSetup<CustomerTextMessageNotificationConfiguration>({
      appId,
      appName: CustomerTextMessageNotificationApp.name,
      schema: customerTextMessageNotificationConfigurationSchema,
    });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col items-center gap-4">
            <FormField
              control={form.control}
              name="autoReply"
              render={({ field }) => (
                <ResizablePanelGroup
                  direction="horizontal"
                  className="max-md:hidden"
                >
                  <ResizablePanel className="pr-4">
                    <FormItem>
                      <FormLabel className="flex flex-row items-center justify-between">
                        <span>
                          Auto reply
                          <InfoTooltip>
                            <p>
                              Can be used for notifying the user that they
                              should not reply to text message
                            </p>
                            <p>Optional</p>
                            <p>* Uses templated values</p>
                          </InfoTooltip>
                        </span>

                        <Button
                          variant="link"
                          type="button"
                          className="px-0 text-xs text-muted-foreground decoration-dashed underline hover:no-underline"
                          onClick={() =>
                            field.onChange(defaultTemplates.autoReply)
                          }
                        >
                          Use default template
                        </Button>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Auto reply"
                          className="mx-0 focus:mx-1 active:mx-1"
                          autoResize
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0} characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel className="pl-4">
                    <FormItem>
                      <FormLabel>Preview</FormLabel>
                      <div
                        className="w-full text-sm"
                        dangerouslySetInnerHTML={{
                          __html: templateSafeWithError(
                            field.value || "",
                            demoArguments
                          ).replaceAll("\n", "<br/>"),
                        }}
                      />
                    </FormItem>
                  </ResizablePanel>
                </ResizablePanelGroup>
              )}
            />
            <TextMessagesTemplateForm
              form={form}
              disabled={isLoading}
              type={"pending"}
              whenText="they book new appointment"
              demoArguments={demoArguments}
            />
            <TextMessagesTemplateForm
              form={form}
              disabled={isLoading}
              type={"confirmed"}
              whenText="the appointment was confirmed"
              demoArguments={demoArguments}
            />
            <TextMessagesTemplateForm
              form={form}
              disabled={isLoading}
              type={"declined"}
              whenText="the appointment was declined"
              demoArguments={demoArguments}
            />
            <TextMessagesTemplateForm
              form={form}
              disabled={isLoading}
              type={"rescheduled"}
              whenText="the appointment was rescheduled"
              demoArguments={demoArguments}
            />
            <SaveButton
              form={form}
              disabled={isLoading}
              isLoading={isLoading}
            />
          </div>
        </form>
      </Form>
      {appStatus && <ConnectedAppStatusMessage app={appStatus} />}
    </>
  );
};
