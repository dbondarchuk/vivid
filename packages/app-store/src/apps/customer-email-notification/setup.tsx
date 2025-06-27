"use client";

import { ComplexAppSetupProps } from "@vivid/types";
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

import { useI18n } from "@vivid/i18n";
import { SaveButton, useDemoArguments } from "@vivid/ui";
import { useConnectedAppSetup } from "../../hooks/use-connected-app-setup";

const EmailTemplateForm: React.FC<{
  form: UseFormReturn<CustomerEmailNotificationConfiguration>;
  disabled?: boolean;
  isDataLoading?: boolean;
  type: EmailTemplateKeys;
  whenText: string;
  demoArguments: Record<string, any>;
}> = ({ form, disabled, isDataLoading, type, whenText, demoArguments }) => {
  const t = useI18n("apps");
  const tAdmin = useI18n("admin");

  return (
    <div className="flex flex-col gap-2 w-full">
      <h3 className="m-0 text-center">
        {t(`customerEmailNotification.form.header`, {
          type: tAdmin(`appointments.status.${type}`),
        })}
      </h3>
      <div className="grid grid-cols-1 md: md:grid-cols-2 gap-2 w-full">
        <FormField
          control={form.control}
          name={`templates.${type}.subject`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t(`customerEmailNotification.form.subject.label`)}
                <InfoTooltip>
                  <p>
                    {t(`customerEmailNotification.form.subject.description`, {
                      whenText,
                    })}
                  </p>
                  <p>{tAdmin("common.usesTemplatedValues")}</p>
                </InfoTooltip>
              </FormLabel>
              <FormControl>
                {isDataLoading ? (
                  <Skeleton className="w-full h-10" />
                ) : (
                  <ArgumentsAutocomplete
                    disabled={disabled}
                    placeholder={t(
                      `customerEmailNotification.form.subject.placeholder`
                    )}
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
                {t(`customerEmailNotification.form.body.label`)}
                <InfoTooltip>
                  {t(`customerEmailNotification.form.body.description`, {
                    whenText,
                  })}
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

  const t = useI18n("apps");
  const tAdmin = useI18n("admin");

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
              whenText={t(`customerEmailNotification.whenText.pending`)}
              demoArguments={demoArguments}
            />
            <EmailTemplateForm
              form={form}
              disabled={isLoading}
              isDataLoading={isDataLoading}
              type={"confirmed"}
              whenText={t(`customerEmailNotification.whenText.confirmed`)}
              demoArguments={demoArguments}
            />
            <EmailTemplateForm
              form={form}
              disabled={isLoading}
              isDataLoading={isDataLoading}
              type={"declined"}
              whenText={t(`customerEmailNotification.whenText.declined`)}
              demoArguments={demoArguments}
            />
            <EmailTemplateForm
              form={form}
              disabled={isLoading}
              isDataLoading={isDataLoading}
              type={"rescheduled"}
              whenText={t(`customerEmailNotification.whenText.rescheduled`)}
              demoArguments={demoArguments}
            />
            <div className="flex flex-col gap-2 w-full">
              <h3 className="m-0 text-center">
                {t(
                  `customerEmailNotification.form.calendarEventTemplate.title`
                )}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                <FormField
                  control={form.control}
                  name="event.summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          `customerEmailNotification.form.calendarEventTemplate.summary.label`
                        )}
                        <InfoTooltip>
                          <p>
                            {t(
                              `customerEmailNotification.form.calendarEventTemplate.summary.description`
                            )}
                          </p>
                          <p>{tAdmin("common.usesTemplatedValues")}</p>
                        </InfoTooltip>
                      </FormLabel>
                      <FormControl>
                        {isDataLoading ? (
                          <Skeleton className="w-full h-10" />
                        ) : (
                          <Input
                            disabled={isLoading}
                            placeholder={t(
                              `customerEmailNotification.form.calendarEventTemplate.summary.placeholder`
                            )}
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
                        {t(
                          `customerEmailNotification.form.calendarEventTemplate.templateId.label`
                        )}
                        <InfoTooltip>
                          {t(
                            `customerEmailNotification.form.calendarEventTemplate.templateId.description`
                          )}
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
      {appStatus && <ConnectedAppStatusMessage app={appStatus} t={t} />}
    </>
  );
};
