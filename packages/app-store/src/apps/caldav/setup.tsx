"use client";

import { AppSetupProps } from "@vivid/types";
import {
  Button,
  ConnectedAppNameAndLogo,
  ConnectedAppStatusMessage,
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
import { processStaticRequest } from "../../actions";
import { useConnectedAppSetup } from "../../hooks/use-connected-app-setup";
import { CaldavApp } from "./app";
import { CaldavCalendarSource, caldavCalendarSourceSchema } from "./models";
import { CALDAV_APP_NAME } from "./const";
import { useI18n } from "@vivid/i18n";

export const CaldavAppSetup: React.FC<AppSetupProps> = ({
  onSuccess,
  onError,
  appId: existingAppId,
}) => {
  const { appStatus, form, isLoading, setIsLoading, isValid, onSubmit } =
    useConnectedAppSetup<CaldavCalendarSource>({
      appId: existingAppId,
      appName: CaldavApp.name,
      schema: caldavCalendarSourceSchema,
      onSuccess,
      onError,
    });

  const t = useI18n("apps");

  const [calendars, setCalendars] = React.useState<string[]>([]);

  const calendarName = form.getValues("calendarName");
  React.useEffect(() => {
    if (!calendarName) return;
    setCalendars(Array.from(new Set(calendars || []).add(calendarName)));
    form.setValue("calendarName", calendarName);
  }, [calendarName]);

  const [fetchingCalendars, setFetchingCalendars] = React.useState(false);
  const fetchCalendars = async () => {
    setFetchingCalendars(true);
    try {
      const result = await processStaticRequest(CALDAV_APP_NAME, {
        ...form.getValues(),
        fetchCalendars: true,
      });

      setCalendars(result);
    } catch (error: any) {
      toast.error(
        t("calDav.toast.failed_to_fetch_calendars", {
          serverUrl: form.getValues("serverUrl"),
        })
      );
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
                    {t("calDav.form.serverUrl.label")}
                    <InfoTooltip>
                      {t("calDav.form.serverUrl.tooltip")}
                    </InfoTooltip>
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
                    {t("calDav.form.username.label")}
                    <InfoTooltip>
                      {t("calDav.form.username.tooltip")}
                    </InfoTooltip>
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
                    {t("calDav.form.password.label")}
                    <InfoTooltip>
                      {t("calDav.form.password.tooltip")}
                    </InfoTooltip>
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
                  <FormLabel>{t("calDav.form.calendar.label")}</FormLabel>
                  <div className="flex flex-row gap-2 items-center">
                    <FormControl className="flex-grow">
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          field.onBlur();
                        }}
                      >
                        <SelectTrigger className="w-full" disabled={isLoading}>
                          <SelectValue
                            placeholder={t("calDav.form.calendar.placeholder")}
                          />
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
                      <span>{t("calDav.form.fetch")}</span>
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
              <span>{t("calDav.form.connectWith")}</span>
              <ConnectedAppNameAndLogo app={{ name: CaldavApp.name }} t={t} />
            </Button>
          </div>
        </form>
      </Form>
      {appStatus && <ConnectedAppStatusMessage app={appStatus} t={t} />}
    </>
  );
};
