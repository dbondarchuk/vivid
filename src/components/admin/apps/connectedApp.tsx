import { ConnectedApp, ConnectedAppStatus } from "@/types";
import { cn } from "@/lib/utils";
import { DeleteAppButton } from "./deleteAppButton";
import { appStatusText, appStatusTextClasses } from "@/apps/apps.const";
import { InstalledApps } from "@/apps";
import { AddOrUpdateAppButton } from "./addOrUpdateAppDialog";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import {
  ConnectedAppAccount,
  ConnectedAppNameAndLogo,
  ConnectedAppStatusMessage,
} from "./connectedAppProperties";

export type ConnectedAppRowProps = {
  app: ConnectedApp;
};

export const ConnectedAppRow: React.FC<ConnectedAppRowProps> = ({ app }) => {
  return (
    <div className="border rounded-md px-2 md:px-4 lg:px-6 py-2 md:py-4 lg:py-6 grid lg:grid-cols-4 gap-4 items-center">
      <ConnectedAppNameAndLogo app={app} className="break-words" />
      <ConnectedAppAccount app={app} className="break-words" />
      <ConnectedAppStatusMessage app={app} className="flex-grow break-words" />
      <div className="flex flex-col gap-2 md:flex-row flex-wrap">
        <AddOrUpdateAppButton app={app}>
          <Button variant="secondary">
            <RefreshCcw /> Update app
          </Button>
        </AddOrUpdateAppButton>
        <DeleteAppButton appId={app._id} />
      </div>
    </div>
  );
};
