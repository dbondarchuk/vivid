import { AppSetupProps, ConnectedApp } from "@/types";
import React from "react";
import {
  addNewApp,
  getAppLoginUrl,
  getAppStatus,
  setAppStatus,
} from "../apps.actions";
import { OutlookApp } from "./outlook.app";
import { Button } from "@/components/ui/button";
import {
  ConnectedAppNameAndLogo,
  ConnectedAppStatusMessage,
} from "@/components/admin/apps/connectedAppProperties";

export const OutlookAppSetup: React.FC<AppSetupProps> = ({
  onSuccess,
  setIsLoading,
  onError,
  onStatusChange,
  appId: existingAppId,
}) => {
  const [app, setApp] = React.useState<ConnectedApp | undefined>(undefined);
  const [timer, setTimer] = React.useState<NodeJS.Timeout>();

  const getStatus = async (appId: string) => {
    const status = await getAppStatus(appId);
    setApp(() => status);

    onStatusChange(status.status, status.statusText);

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
          statusText: "Pending authorization",
        });
      } else {
        appId = await addNewApp(OutlookApp.name);
      }

      const loginUrl = await getAppLoginUrl(appId);

      getStatus(appId);
      window.open(loginUrl, "_blank", "popup=true");
    } catch (e: any) {
      onError(e?.message);

      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="default"
          onClick={connectApp}
          className="inline-flex gap-2 items-center w-full"
        >
          <span>Connect with</span>
          <ConnectedAppNameAndLogo app={{ name: OutlookApp.name }} />
        </Button>
      </div>
      {app && <ConnectedAppStatusMessage app={app} />}
    </>
  );
};
