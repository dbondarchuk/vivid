"use client";

import { AvailableApps } from "@vivid/app-store";
import { Button, useToast } from "@vivid/ui";
import { useRouter } from "next/navigation";
import React from "react";
import { installComplexApp, setAppStatus } from "./actions";

export const InstallComplexAppButton: React.FC<{
  appName: string;
  installed: number;
}> = ({ appName, installed }) => {
  const app = React.useMemo(() => AvailableApps[appName], [appName]);
  const router = useRouter();
  const { toast } = useToast();

  const installComplex = async () => {
    if (app.type !== "complex" && app.type !== "system") return;

    try {
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

      toast({
        variant: "default",
        title: "Success!",
        description: "Your app was successfully connected",
      });
    } catch (error: any) {
      console.error(`Failed to set up app: ${error}`);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "The request to connect the app has failed. Please try again.",
      });
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
