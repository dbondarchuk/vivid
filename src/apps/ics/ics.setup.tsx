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
import { IcsApp } from "./ics.app";
import {
  IcsLinkCalendarSource,
  icsLinkCalendarSourceSchema,
} from "./ics.models";

export const IcsAppSetup: React.FC<AppSetupProps> = ({
  onSuccess,
  setIsLoading,
  onError,
  onStatusChange,
  appId: existingAppId,
}) => {
  const [appId, setAppId] = React.useState<string>();

  const [initialAppData, setInitialAppData] =
    React.useState<IcsLinkCalendarSource>();
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

  const form = useForm<IcsLinkCalendarSource>({
    resolver: zodResolver(icsLinkCalendarSourceSchema),
    mode: "all",
    values: initialAppData,
  });

  const createApp = async (data: IcsLinkCalendarSource) => {
    try {
      setIsLoading(true);

      const _appId = appId || (await addNewApp(IcsApp.name));
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
              name="link"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    ICS link <InfoTooltip>URL to ICS calendar</InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://" {...field} />
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
              <span className="inline-flex items-center gap-2">
                <IcsApp.Logo /> {IcsApp.displayName}
              </span>
            </Button>
          </div>
        </form>
      </Form>
      {appStatus && (
        <div className="flex flex-col gap-2">
          <div className={cn(appStatusTextClasses[appStatus.status])}>
            Status: {appStatusText[appStatus.status]}, {appStatus.statusText}
          </div>
        </div>
      )}
    </>
  );
};
