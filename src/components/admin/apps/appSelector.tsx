import { AppScope, ConnectedApp } from "@/types";
import {
  ConnectedAppAccount,
  ConnectedAppNameAndLogo,
  ConnectedAppStatusMessage,
} from "./connectedAppProperties";
import React from "react";
import { Combobox, IComboboxItem } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { InstalledApps } from "@/apps";

const AppShortLabel: React.FC<{ app: ConnectedApp }> = ({ app }) => {
  return (
    <span className="inline-flex items-center gap-2">
      <ConnectedAppNameAndLogo app={app} />
      <ConnectedAppAccount app={app} />
    </span>
  );
};

const checkAppSearch = (app: ConnectedApp, query: string) => {
  const search = query.toLocaleLowerCase();
  return (
    app.name.toLocaleLowerCase().includes(search) ||
    app.account?.username?.toLocaleLowerCase().includes(search) ||
    (app.account as any)?.serverUrl?.toLocaleLowerCase().includes(search)
  );
};

type BaseAppSelectorProps = {
  apps: ConnectedApp[];
  type: AppScope;
  value?: string;
  disabled?: boolean;
  className?: string;
};

type ClearableAppSelectorProps = {
  onItemSelect?: (value: string | undefined) => void;
  allowClear: true;
};

type NonClearablAppSelectorProps = {
  onItemSelect?: (value: string) => void;
  allowClear?: false;
};

export type AppSelectorProps = BaseAppSelectorProps &
  (ClearableAppSelectorProps | NonClearablAppSelectorProps);

export const AppSelector: React.FC<AppSelectorProps> = ({
  apps,
  type,
  disabled,
  className,
  value,
  onItemSelect,
  allowClear,
}) => {
  const supportedApps = apps.filter(
    (app) => InstalledApps[app.name]?.scope.indexOf(type) >= 0
  );

  const appValues = (apps: ConnectedApp[]): IComboboxItem[] =>
    apps.map((app) => {
      return {
        value: app._id,
        shortLabel: <AppShortLabel app={app} />,
        label: (
          <div className="flex flex-col gap-2">
            <AppShortLabel app={app} />
            <ConnectedAppStatusMessage app={app} />
          </div>
        ),
      };
    });

  return (
    // @ts-ignore Allow clear passthrough
    <Combobox
      allowClear={allowClear}
      disabled={disabled}
      className={cn("flex font-normal text-base", className)}
      values={appValues(supportedApps)}
      searchLabel="Select app"
      value={value}
      customSearch={(search) =>
        appValues(supportedApps.filter((app) => checkAppSearch(app, search)))
      }
      onItemSelect={onItemSelect}
    />
  );
};
