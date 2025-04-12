"use client";

import { ComplexAppSetupProps, StatusText } from "@vivid/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InfoTooltip,
  Skeleton,
  TemplateSelector,
} from "@vivid/ui";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CustomerTextMessageNotificationApp } from "./app";
import {
  CustomerTextMessageNotificationConfiguration,
  customerTextMessageNotificationConfigurationSchema,
  TextMessagesTemplateKeys,
} from "./models";

import { SaveButton } from "@vivid/ui";
import { useConnectedAppSetup } from "../../hooks/use-connected-app-setup";

const templateKeyText: Record<TextMessagesTemplateKeys, string> = {
  ...StatusText,
  rescheduled: "Rescheduled",
};

const TextMessagesTemplateForm: React.FC<{
  form: UseFormReturn<CustomerTextMessageNotificationConfiguration>;
  disabled?: boolean;
  type: TextMessagesTemplateKeys;
  isDataLoading?: boolean;
  whenText: string;
}> = ({ form, disabled, type, whenText, isDataLoading }) => {
  return (
    <FormField
      control={form.control}
      name={`templates.${type}.templateId`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {templateKeyText[type]} text message template
            <InfoTooltip>
              <p>
                Body of the text message, that your customers will see when{" "}
                {whenText}
              </p>
              <p>Leave empty to not send text message when {whenText}</p>
            </InfoTooltip>
          </FormLabel>
          <FormControl>
            {isDataLoading ? (
              <Skeleton className="w-full h-10" />
            ) : (
              <TemplateSelector
                type="text-message"
                disabled={disabled}
                value={field.value}
                onItemSelect={(value) => field.onChange(value)}
                allowClear
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const CustomerTextMessageNotificationAppSetup: React.FC<
  ComplexAppSetupProps
> = ({ appId }) => {
  const { form, isLoading, isDataLoading, onSubmit } =
    useConnectedAppSetup<CustomerTextMessageNotificationConfiguration>({
      appId,
      appName: CustomerTextMessageNotificationApp.name,
      schema: customerTextMessageNotificationConfigurationSchema,
    });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
            <TextMessagesTemplateForm
              form={form}
              disabled={isLoading}
              isDataLoading={isDataLoading}
              type={"pending"}
              whenText="they book new appointment"
            />
            <TextMessagesTemplateForm
              form={form}
              disabled={isLoading}
              isDataLoading={isDataLoading}
              type={"confirmed"}
              whenText="the appointment was confirmed"
            />
            <TextMessagesTemplateForm
              form={form}
              disabled={isLoading}
              isDataLoading={isDataLoading}
              type={"declined"}
              whenText="the appointment was declined"
            />
            <TextMessagesTemplateForm
              form={form}
              disabled={isLoading}
              isDataLoading={isDataLoading}
              type={"rescheduled"}
              whenText="the appointment was rescheduled"
            />
            <FormField
              control={form.control}
              name="autoReply"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Auto reply
                    <InfoTooltip>
                      <p>
                        Can be used for notifying the user that they should not
                        reply to text message
                      </p>
                      <p>Optional</p>
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    {isDataLoading ? (
                      <Skeleton className="w-full h-10" />
                    ) : (
                      <TemplateSelector
                        type="text-message"
                        disabled={isLoading}
                        value={field.value}
                        onItemSelect={(value) => field.onChange(value)}
                        allowClear
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SaveButton
              form={form}
              disabled={isLoading}
              isLoading={isLoading}
            />
          </div>
        </form>
      </Form>
    </>
  );
};
