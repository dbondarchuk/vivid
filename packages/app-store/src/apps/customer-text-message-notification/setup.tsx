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
import { useI18n } from "@vivid/i18n";

const TextMessagesTemplateForm: React.FC<{
  form: UseFormReturn<CustomerTextMessageNotificationConfiguration>;
  disabled?: boolean;
  type: TextMessagesTemplateKeys;
  isDataLoading?: boolean;
  whenText: string;
}> = ({ form, disabled, type, whenText, isDataLoading }) => {
  const t = useI18n("apps");

  const getTypeText = (type: TextMessagesTemplateKeys) => {
    if (type === "rescheduled") return "Rescheduled";
    return StatusText[type as keyof typeof StatusText];
  };

  return (
    <FormField
      control={form.control}
      name={`templates.${type}.templateId`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {t("customerTextMessageNotification.form.template.label", {
              type: getTypeText(type),
            })}
            <InfoTooltip>
              <p>
                {t("customerTextMessageNotification.form.template.tooltip", {
                  whenText,
                })}
              </p>
              <p>
                {t(
                  "customerTextMessageNotification.form.template.tooltipEmpty",
                  { whenText }
                )}
              </p>
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

  const t = useI18n("apps");

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
              whenText={t("customerTextMessageNotification.whenText.pending")}
            />
            <TextMessagesTemplateForm
              form={form}
              disabled={isLoading}
              isDataLoading={isDataLoading}
              type={"confirmed"}
              whenText={t("customerTextMessageNotification.whenText.confirmed")}
            />
            <TextMessagesTemplateForm
              form={form}
              disabled={isLoading}
              isDataLoading={isDataLoading}
              type={"declined"}
              whenText={t("customerTextMessageNotification.whenText.declined")}
            />
            <TextMessagesTemplateForm
              form={form}
              disabled={isLoading}
              isDataLoading={isDataLoading}
              type={"rescheduled"}
              whenText={t(
                "customerTextMessageNotification.whenText.rescheduled"
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
