"use client";

import { useI18n } from "@vivid/i18n";
import { ComplexAppSetupProps } from "@vivid/types";
import {
  BooleanSelect,
  ConnectedAppStatusMessage,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InfoTooltip,
  Input,
  SaveButton,
} from "@vivid/ui";
import React from "react";
import { useConnectedAppSetup } from "../../hooks/use-connected-app-setup";
import { SmtpApp } from "./app";
import { SmtpConfiguration, smtpConfigurationSchema } from "./models";

export const SmtpAppSetup: React.FC<ComplexAppSetupProps> = ({ appId }) => {
  const t = useI18n("apps");
  const { appStatus, form, isLoading, isValid, onSubmit } =
    useConnectedAppSetup<SmtpConfiguration>({
      appId,
      appName: SmtpApp.name,
      schema: smtpConfigurationSchema,
    });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col items-center gap-4">
            <div className="w-full gap-2 flex flex-col md:grid md:grid-cols-2 md:gap-4">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("smtp.form.host.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("smtp.form.host.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("smtp.form.port.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("smtp.form.port.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("smtp.form.secure.label")}</FormLabel>
                    <FormControl>
                      <BooleanSelect
                        className="w-full"
                        {...field}
                        value={field.value}
                        trueLabel={t("smtp.form.secure.yes")}
                        falseLabel={t("smtp.form.secure.no")}
                        onValueChange={(e) => {
                          field.onChange(e);
                          field.onBlur();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("smtp.form.email.label")}{" "}
                      <InfoTooltip>{t("smtp.form.email.tooltip")}</InfoTooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("smtp.form.email.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="auth.user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("smtp.form.authUser.label")}
                      <InfoTooltip>
                        {t("smtp.form.authUser.tooltip")}
                      </InfoTooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="new-password"
                        placeholder={t("smtp.form.authUser.placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="auth.pass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("smtp.form.authPass.label")}
                      <InfoTooltip>
                        {t("smtp.form.authPass.tooltip")}
                      </InfoTooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <SaveButton
              form={form}
              disabled={isLoading}
              isLoading={isLoading}
            />
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
