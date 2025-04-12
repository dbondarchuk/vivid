import { AvailableApps } from "@vivid/app-store";
import { ConnectedApp } from "@vivid/types";
import {
  Button,
  ConnectedAppAccount,
  ConnectedAppNameAndLogo,
  ConnectedAppStatusMessage,
  Link,
} from "@vivid/ui";
import { RefreshCcw } from "lucide-react";
import { AddOrUpdateAppButton } from "./add-or-update-app-dialog";
import { DeleteAppButton } from "./delete-app-button";

export type ConnectedAppRowProps = {
  app: ConnectedApp;
};

export const ConnectedAppRow: React.FC<ConnectedAppRowProps> = ({ app }) => {
  const appDescriptor = AvailableApps[app.name];
  return (
    <div className="border rounded-md px-2 md:px-4 lg:px-6 py-2 md:py-4 lg:py-6 grid lg:grid-cols-4 gap-4 items-center bg-card">
      <ConnectedAppNameAndLogo app={app} className="break-words" />
      <ConnectedAppAccount app={app} className="break-words" />
      <ConnectedAppStatusMessage app={app} className="flex-grow break-words" />
      <div className="flex flex-col gap-2 md:flex-row flex-wrap justify-end">
        {appDescriptor.type === "complex" && appDescriptor.settingsHref ? (
          <Link
            button
            href={`/admin/dashboard/${appDescriptor.settingsHref}`}
            variant="secondary"
          >
            <RefreshCcw /> Update app
          </Link>
        ) : (
          <AddOrUpdateAppButton app={app}>
            <Button variant="secondary">
              <RefreshCcw /> Update app
            </Button>
          </AddOrUpdateAppButton>
        )}
        <DeleteAppButton appId={app._id} />
      </div>
    </div>
  );
};
