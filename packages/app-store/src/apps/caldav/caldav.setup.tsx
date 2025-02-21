"use client";

import { AppSetupProps } from "@vivid/types";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InfoTooltip,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
  toast,
} from "@vivid/ui";
import React from "react";
import { processRequest } from "../../actions";
import { useConnectedAppSetup } from "../../hooks/use-connected-app-setup";
import {
  ConnectedAppNameAndLogo,
  ConnectedAppStatusMessage,
} from "../../ui/connected-app-properties";
import { CaldavApp } from "./caldav.app";
import {
  CaldavCalendarSource,
  caldavCalendarSourceSchema,
} from "./caldav.models";

export const CaldavAppSetup: React.FC<AppSetupProps> = ({
  onSuccess,
  onError,
  appId: existingAppId,
}) => {
  const { appId, appStatus, form, isLoading, setIsLoading, isValid, onSubmit } =
    useConnectedAppSetup<CaldavCalendarSource>({
      appId: existingAppId,
      appName: CaldavApp.name,
      schema: caldavCalendarSourceSchema,
      onSuccess,
      onError,
    });

  const [calendars, setCalendars] = React.useState<string[]>([]);

  const calendarName = form.getValues("calendarName");
  React.useEffect(() => {
    if (!calendarName) return;
    setCalendars(Array.from(new Set(calendars || []).add(calendarName)));
  }, [calendarName]);

  const [fetchingCalendars, setFetchingCalendars] = React.useState(false);
  const fetchCalendars = async () => {
    setFetchingCalendars(true);
    try {
      const result = await processRequest(appId || "", {
        ...form.getValues(),
        fetchCalendars: true,
      });

      setCalendars(result);
    } catch (error: any) {
      toast.error("Failed to fetch calendars from CalDAV server");
      console.error(error);
    } finally {
      setFetchingCalendars(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
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
                    <Input
                      type="password"
                      placeholder="********"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="calendarName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Calendar</FormLabel>
                  <div className="flex flex-row gap-1 items-center">
                    <FormControl className="flex-grow">
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          field.onBlur();
                        }}
                      >
                        <SelectTrigger className="w-full" disabled={isLoading}>
                          <SelectValue placeholder="Select calendar" />
                        </SelectTrigger>
                        <SelectContent side="bottom">
                          {calendars.map((calendar) => (
                            <SelectItem key={calendar} value={calendar}>
                              {calendar}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <Button
                      disabled={isLoading}
                      type="button"
                      variant="primary"
                      className="inline-flex gap-2 items-center"
                      onClick={fetchCalendars}
                    >
                      {fetchingCalendars && <Spinner />}
                      <span>Fetch</span>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading || !isValid}
              type="submit"
              variant="default"
              className="inline-flex gap-2 items-center w-full"
            >
              {isLoading && <Spinner />}
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
