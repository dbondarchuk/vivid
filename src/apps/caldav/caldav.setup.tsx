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
import { CaldavApp } from "./caldav.app";
import {
  CaldavCalendarSource,
  caldavCalendarSourceSchema,
} from "./caldav.models";
import {
  ConnectedAppNameAndLogo,
  ConnectedAppStatusMessage,
} from "@/components/admin/apps/connectedAppProperties";

export const CaldavAppSetup: React.FC<AppSetupProps> = ({
  onSuccess,
  setIsLoading,
  onError,
  onStatusChange,
  appId: existingAppId,
}) => {
  const [appId, setAppId] = React.useState<string>();

  const [initialAppData, setInitialAppData] =
    React.useState<CaldavCalendarSource>();
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

  const form = useForm<CaldavCalendarSource>({
    resolver: zodResolver(caldavCalendarSourceSchema),
    mode: "all",
    values: initialAppData,
  });

  const createApp = async (data: CaldavCalendarSource) => {
    try {
      setIsLoading(true);

      const _appId = appId || (await addNewApp(CaldavApp.name));
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
            <FormField
              control={form.control}
              name="serverUrl"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    CalDAV Server{" "}
                    <InfoTooltip>URL to CalDAV server</InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Username
                    <InfoTooltip>Optional username</InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Password
                    <InfoTooltip>Optional password</InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="default"
              className="inline-flex gap-2 items-center w-full"
            >
              <span>Connect with</span>
              <ConnectedAppNameAndLogo app={{ name: CaldavApp.name }} />
            </Button>
          </div>
        </form>
      </Form>
      {appStatus && <ConnectedAppStatusMessage app={appStatus} />}
    </>
  );
};
