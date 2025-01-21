import { ConnectedApp, ConnectedAppStatus } from "@/types";
import { cn } from "@/lib/utils";
import { DeleteAppButton } from "./deleteAppButton";
import { appStatusText, appStatusTextClasses } from "@/apps/apps.const";
import { InstalledApps } from "@/apps";
import { AddOrUpdateAppButton } from "./addOrUpdateAppDialog";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export type ConnectedAppRowProps = {
  app: ConnectedApp;
};

export const ConnectedAppRow: React.FC<ConnectedAppRowProps> = ({ app }) => {
  const App = InstalledApps[app.name];
  return (
    <div className="border rounded-md px-2 md:px-4 lg:px-6 py-2 md:py-4 lg:py-6 flex flex-col lg:flex-row gap-4 items-center">
      <div className="inline-flex items-center gap-2">
        <App.Logo className="w-6 y-6" />
        <span>{App.displayName}</span>
      </div>
      <div>
        {app.account?.username && (
          <span className="text-sm text-muted-foreground">
            ({app.account.username})
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 flex-grow">
        <div className={cn(appStatusTextClasses[app.status])}>
          Status: {appStatusText[app.status]}, {app.statusText}
        </div>
      </div>
      <div className="flex flex-col gap-2 md:flex-row">
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
