"use client";

import { AvailableApps } from "@vivid/app-store";
import { Button, toastPromise } from "@vivid/ui";
import { useRouter } from "next/navigation";
import React from "react";
import { installComplexApp, setAppStatus } from "./actions";

export const InstallComplexAppButton: React.FC<{
  appName: string;
  installed: number;
}> = ({ appName, installed }) => {
  const app = React.useMemo(() => AvailableApps[appName], [appName]);
  const router = useRouter();

  const installComplex = async () => {
    if (app.type !== "complex" && app.type !== "system") return;

    const installFn = async () => {
      const appId = await installComplexApp(appName);
      if (app.type === "complex") {
        router.push(`/admin/dashboard/${app.menuItem.href}`);
      } else if (app.type === "system") {
        await setAppStatus(appId, {
          status: "connected",
          statusText: "Installed",
        });

        router.refresh();
      }
    };

    try {
      await toastPromise(installFn(), {
        success: "Your app was successfully connected.",
        error: "The request to connect the app has failed. Please try again.",
      });
    } catch (error: any) {
      console.error(`Failed to set up app: ${error}`);
    }
  };
  return (
    <Button
      variant="default"
      disabled={app.dontAllowMultiple && installed > 0}
      onClick={installComplex}
    >
      {app.dontAllowMultiple && installed > 0 ? "Already installed" : "Add app"}
    </Button>
  );
};
