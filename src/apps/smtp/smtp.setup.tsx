"use client";

import { ComplexAppSetupProps } from "@/types";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InfoTooltip } from "@/components/admin/tooltip/infoTooltip";
import { SmtpApp } from "./smtp.app";
import { SmtpConfiguration, smtpConfigurationSchema } from "./smtp.models";
import { Switch } from "@/components/ui/switch";
import {
  ConnectedAppNameAndLogo,
  ConnectedAppStatusMessage,
} from "@/components/admin/apps/connectedAppProperties";
import { useConnectedAppSetup } from "@/hooks/useConnectedAppSetup";
import { SaveButton } from "@/components/admin/forms/save-button";

export const SmtpAppSetup: React.FC<ComplexAppSetupProps> = ({ appId }) => {
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
                    <FormLabel>SMTP Host</FormLabel>
                    <FormControl>
                      <Input placeholder="smtp.email.com" {...field} />
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
                    <FormLabel>SMTP port</FormLabel>
                    <FormControl>
                      <Input placeholder="465" {...field} />
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
                    <FormLabel>SMTP SSL</FormLabel>
                    <FormControl className="block">
                      <Switch
                        {...field}
                        value={`${field.value}`}
                        checked={field.value}
                        onCheckedChange={field.onChange}
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
                      Sender email{" "}
                      <InfoTooltip>
                        Email address from which all emails will be sent
                      </InfoTooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@exampl.com"
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
                      SMTP authentication user
                      <InfoTooltip>
                        Username to log in into SMTP server
                      </InfoTooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="new-password"
                        placeholder="john"
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
                      SMTP authentication password
                      <InfoTooltip>
                        Password to log in into SMTP server
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
      {appStatus && <ConnectedAppStatusMessage app={appStatus} />}
    </>
  );
};
