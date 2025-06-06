"use client";

import { ComplexAppSetupProps, StatusText } from "@vivid/types";
import {
  ArgumentsAutocomplete,
  ConnectedAppStatusMessage,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InfoTooltip,
  Input,
  Skeleton,
  TemplateSelector,
} from "@vivid/ui";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CustomerEmailNotificationApp } from "./app";
import {
  CustomerEmailNotificationConfiguration,
  customerEmailNotificationConfigurationSchema,
  EmailTemplateKeys,
} from "./models";

import { SaveButton, useDemoArguments } from "@vivid/ui";
import { useConnectedAppSetup } from "../../hooks/use-connected-app-setup";

const templateKeyText: Record<EmailTemplateKeys, string> = {
  ...StatusText,
  rescheduled: "Rescheduled",
};

const EmailTemplateForm: React.FC<{
  form: UseFormReturn<CustomerEmailNotificationConfiguration>;
  disabled?: boolean;
  isDataLoading?: boolean;
  type: EmailTemplateKeys;
  whenText: string;
  demoArguments: Record<string, any>;
}> = ({ form, disabled, isDataLoading, type, whenText, demoArguments }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h3 className="m-0 text-center">
        {templateKeyText[type]} email template
      </h3>
      <div className="grid grid-cols-1 md: md:grid-cols-2 gap-2 w-full">
        <FormField
          control={form.control}
          name={`templates.${type}.subject`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email subject
                <InfoTooltip>
                  <p>
                    Subject of the email, that your customers will see when{" "}
                    {whenText}
                  </p>
                  <p>* Uses templated values</p>
                </InfoTooltip>
              </FormLabel>
              <FormControl>
                {isDataLoading ? (
                  <Skeleton className="w-full h-10" />
                ) : (
                  <ArgumentsAutocomplete
                    disabled={disabled}
                    placeholder="Subject"
                    {...field}
                    asInput
                    args={demoArguments}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`templates.${type}.templateId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email tempalte
                <InfoTooltip>
                  Email body, that your customers will see when {whenText}
                </InfoTooltip>
              </FormLabel>
              <FormControl>
                {isDataLoading ? (
                  <Skeleton className="w-full h-10" />
                ) : (
                  <TemplateSelector
                    type="email"
                    disabled={disabled}
                    value={field.value}
                    onItemSelect={(value) => field.onChange(value)}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export const CustomerEmailNotificationAppSetup: React.FC<
  ComplexAppSetupProps
> = ({ appId }) => {
  const demoArguments = useDemoArguments();
  const { appStatus, form, isLoading, isDataLoading, isValid, onSubmit } =
    useConnectedAppSetup<CustomerEmailNotificationConfiguration>({
      appId,
      appName: CustomerEmailNotificationApp.name,
      schema: customerEmailNotificationConfigurationSchema,
    });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="w-full flex flex-col items-center gap-8">
            <EmailTemplateForm
              form={form}
              disabled={isLoading}
              isDataLoading={isDataLoading}
              type={"pending"}
              whenText="they book new appointment"
              demoArguments={demoArguments}
            />
            <EmailTemplateForm
              form={form}
              disabled={isLoading}
              isDataLoading={isDataLoading}
              type={"confirmed"}
              whenText="the appointment was confirmed"
              demoArguments={demoArguments}
            />
            <EmailTemplateForm
              form={form}
              disabled={isLoading}
              isDataLoading={isDataLoading}
              type={"declined"}
              whenText="the appointment was declined"
              demoArguments={demoArguments}
            />
            <EmailTemplateForm
              form={form}
              disabled={isLoading}
              isDataLoading={isDataLoading}
              type={"rescheduled"}
              whenText="the appointment was rescheduled"
              demoArguments={demoArguments}
            />
            <div className="flex flex-col gap-2 w-full">
              <h3 className="m-0 text-center">Calendar event template</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                <FormField
                  control={form.control}
                  name="event.summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Event summary
                        <InfoTooltip>
                          <p>
                            Summary of the event, that your customers will see
                            in their calendar
                          </p>
                          <p>* Uses templated values</p>
                        </InfoTooltip>
                      </FormLabel>
                      <FormControl>
                        {isDataLoading ? (
                          <Skeleton className="w-full h-10" />
                        ) : (
                          <Input
                            disabled={isLoading}
                            placeholder="Subject"
                            {...field}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="event.templateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Event content
                        <InfoTooltip>
                          Summary of the event, that your customers will see in
                          their calendar
                        </InfoTooltip>
                      </FormLabel>
                      <FormControl>
                        {isDataLoading ? (
                          <Skeleton className="w-full h-10" />
                        ) : (
                          <TemplateSelector
                            type="email"
                            disabled={isLoading}
                            value={field.value}
                            onItemSelect={(value) => field.onChange(value)}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
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
