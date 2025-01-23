"use client";

import { AppSetupProps, ConnectedAppStatusWithText } from "@/types";
import React from "react";
import { addNewApp, getAppData, processRequest } from "../apps.actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { appStatusText, appStatusTextClasses } from "../apps.const";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

export const SmtpAppSetup: React.FC<AppSetupProps> = ({
  onSuccess,
  setIsLoading,
  onError,
  onStatusChange,
  appId: existingAppId,
}) => {
  const [appId, setAppId] = React.useState<string>();

  const [initialAppData, setInitialAppData] =
    React.useState<SmtpConfiguration>();
  React.useEffect(() => {
    if (!existingAppId) return;

    const getInitialData = async () => {
      const data = await getAppData(existingAppId);
      setInitialAppData(data);
    };

    setAppId(existingAppId);
    getInitialData();
  }, [existingAppId]);

  const [appStatus, setAppStatus] =
    React.useState<ConnectedAppStatusWithText>();

  const form = useForm<SmtpConfiguration>({
    resolver: zodResolver(smtpConfigurationSchema),
    mode: "all",
    values: initialAppData,
  });

  const createApp = async (data: SmtpConfiguration) => {
    try {
      setIsLoading(true);

      const _appId = appId || (await addNewApp(SmtpApp.name));
      setAppId(_appId);

      const status = (await processRequest(
        _appId,
        data
      )) as ConnectedAppStatusWithText;

      onStatusChange(status.status, status.statusText);
      setAppStatus(status);

      if (status.status === "connected") {
        onSuccess();
      } else if (status.status === "failed") {
        onError(status.statusText);
      }
    } catch (e: any) {
      onError(e?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createApp)} className="w-full">
          <div className="flex flex-col items-center gap-2">
            <div className="gap-2 flex flex-col md:grid md:grid-cols-2 md:gap-4">
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
                      <Input placeholder="john" {...field} />
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              variant="default"
              className="inline-flex gap-2 items-center w-full"
            >
              <span>Connect with</span>
              <ConnectedAppNameAndLogo app={{ name: SmtpApp.name }} />
            </Button>
          </div>
        </form>
      </Form>
      {appStatus && <ConnectedAppStatusMessage app={appStatus} />}
    </>
  );
};
