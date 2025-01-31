"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { installComplexApp } from "./actions";
import React from "react";
import { AvailableApps } from "@/apps";

export const InstallComplexAppButton: React.FC<{
  appName: string;
  installed: number;
}> = ({ appName, installed }) => {
  const app = React.useMemo(() => AvailableApps[appName], [appName]);
  const router = useRouter();
  const { toast } = useToast();

  const installComplex = async () => {
    if (app.type !== "complex") return;

    try {
      await installComplexApp(appName);
      router.push(`/admin/dashboard/${app.menuItem.href}`);

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
