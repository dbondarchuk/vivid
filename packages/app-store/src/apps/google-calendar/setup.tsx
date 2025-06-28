import { AppSetupProps, ConnectedApp } from "@vivid/types";
import {
  Button,
  Combobox,
  ConnectedAppNameAndLogo,
  ConnectedAppStatusMessage,
  Label,
  Spinner,
  toast,
  toastPromise,
} from "@vivid/ui";
import React from "react";
import { useI18n } from "@vivid/i18n";
import {
  addNewApp,
  getAppLoginUrl,
  getAppStatus,
  processRequest,
  setAppStatus,
} from "../../actions";
import { GoogleCalendarApp } from "./app";
import { CalendarListItem, RequestAction } from "./models";

export const GoogleAppSetup: React.FC<AppSetupProps> = ({
  onSuccess,
  onError,
  appId: existingAppId,
}) => {
  const t = useI18n("apps");
  const [isLoading, setIsLoading] = React.useState(false);

  const [app, setApp] = React.useState<ConnectedApp | undefined>(undefined);
  const [timer, setTimer] = React.useState<NodeJS.Timeout>();

  const appId = app?._id ?? existingAppId;

  const primaryCalendar: CalendarListItem = {
    id: "primary",
    name: t("googleCalendar.primaryCalendar"),
  };

  const [calendars, setCalendars] = React.useState<CalendarListItem[]>([
    primaryCalendar,
  ]);

  const [selectedCalendar, setSelectedCalendar] =
    React.useState<string>("primary");

  React.useEffect(() => {
    if (!appId) return;

    const fn = async () => {
      setIsLoading(true);
      try {
        const [calendarList, selected] = await Promise.all([
          processRequest(appId, {
            type: "get-calendar-list",
          } as RequestAction),
          processRequest(appId, {
            type: "get-selected-calendar",
          } as RequestAction),
        ]);

        setCalendars([primaryCalendar, ...(calendarList ?? [])]);
        setSelectedCalendar(selected ?? primaryCalendar.id);
      } catch (e: any) {
        console.error(e);
        toast.error("Failed to retrieve calendar list");
      } finally {
        setIsLoading(false);
      }
    };

    fn();
  }, [appId, t]);

  const updateCalendarObject = async (calendar?: CalendarListItem) => {
    if (!appId || !calendar) return;

    setIsLoading(true);
    try {
      await toastPromise(
        processRequest(appId, {
          type: "set-calendar",
          calendar,
        } as RequestAction),
        {
          success: t("googleCalendar.toast.changes_saved"),
          error: t("googleCalendar.toast.request_error"),
        }
      );
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatus = async (appId: string) => {
    const status = await getAppStatus(appId);
    setApp(() => status);

    if (status.status === "pending") {
      const id = setTimeout(() => getStatus(appId), 1000);
      setTimer(id);
      return;
    }

    setIsLoading(false);

    if (status.status === "connected") {
      onSuccess();
      return;
    }

    onError(status.statusText);
  };

  const clearTimer = () => {
    if (timer) clearTimeout(timer);
  };

  React.useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  const connectApp = async () => {
    try {
      setIsLoading(true);

      let appId: string;
      if (app?._id || existingAppId) {
        appId = (app?._id || existingAppId)!;
        await setAppStatus(appId, {
          status: "pending",
          statusText: "googleCalendar.form.pendingAuthorization",
        });
      } else {
        appId = await addNewApp(GoogleCalendarApp.name);
      }

      const loginUrl = await getAppLoginUrl(appId);

      getStatus(appId);
      window.open(loginUrl, "_blank", "popup=true");
    } catch (e: any) {
      onError(e?.message);

      setIsLoading(false);
    }
  };

  const calendarListValues = React.useMemo(
    () =>
      calendars?.map((c) => ({
        value: c.id,
        label: c.name,
      })) ?? [],
    [calendars]
  );

  return (
    <>
      {appId && (
        <div className="flex flex-col gap-2">
          <Label>{t("googleCalendar.form.selectCalendar.label")}</Label>
          <Combobox
            values={calendarListValues}
            disabled={isLoading}
            className="flex w-full font-normal text-base"
            searchLabel={t("googleCalendar.form.selectCalendar.searchLabel")}
            value={selectedCalendar}
            onItemSelect={(value) => {
              setSelectedCalendar(value);
              updateCalendarObject(calendars?.find((c) => c.id === value));
            }}
          />
        </div>
      )}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="default"
          onClick={connectApp}
          disabled={isLoading}
          className="inline-flex gap-2 items-center w-full"
        >
          {isLoading && <Spinner />}
          <span>
            {appId
              ? t("googleCalendar.form.reconnect")
              : t("googleCalendar.form.connect")}
          </span>
          <ConnectedAppNameAndLogo
            app={{ name: GoogleCalendarApp.name }}
            t={t}
          />
        </Button>
      </div>
      {app && <ConnectedAppStatusMessage app={app} t={t} />}
    </>
  );
};
