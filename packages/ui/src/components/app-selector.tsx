import { AppScope, ConnectedApp } from "@vivid/types";
import { cn, Combobox, IComboboxItem, toast } from "@vivid/ui";
import React from "react";
import {
  ConnectedAppAccount,
  ConnectedAppNameAndLogo,
  ConnectedAppStatusMessage,
} from "./connected-app-properties";

const AppShortLabel: React.FC<{ app: ConnectedApp }> = ({ app }) => {
  return (
    <span className="flex flex-row items-center gap-2 shrink overflow-hidden text-nowrap min-w-0 max-w-[var(--radix-popover-trigger-width)]">
      <ConnectedAppNameAndLogo app={app} logoClassName="w-4 h-4" />
      <ConnectedAppAccount app={app} />
    </span>
  );
};

const getApps = async (scope: string) => {
  const url = `/admin/api/apps?scope=${encodeURIComponent(scope)}`;
  const response = await fetch(url, {
    method: "GET",
    cache: "default",
  });

  if (response.status >= 400) {
    toast.error("Request failed.");
    const text = await response.text();
    console.error(`Request to fetch apps failed: ${response.status}; ${text}`);

    return [];
  }

  return (await response.json()) as ConnectedApp[];
};

const checkAppSearch = (app: ConnectedApp, query: string) => {
  const search = query.toLocaleLowerCase();
  return (
    app.name.toLocaleLowerCase().includes(search) ||
    app.account?.username?.toLocaleLowerCase().includes(search) ||
    (app.account as any)?.serverUrl?.toLocaleLowerCase().includes(search) ||
    app.account?.additional?.toLocaleLowerCase().includes(search)
  );
};

type BaseAppSelectorProps = {
  scope: AppScope;
  value?: string;
  disabled?: boolean;
  className?: string;
  excludeIds?: string[];
  setAppName?: (appName?: string) => void;
};

type ClearableAppSelectorProps = {
  onItemSelect?: (value: string | undefined) => void;
  allowClear: true;
};

type NonClearableAppSelectorProps = {
  onItemSelect?: (value: string) => void;
  allowClear?: false;
};

export type AppSelectorProps = BaseAppSelectorProps &
  (ClearableAppSelectorProps | NonClearableAppSelectorProps);

export const AppSelector: React.FC<AppSelectorProps> = ({
  scope,
  disabled,
  className,
  excludeIds,
  value,
  onItemSelect,
  allowClear,
  setAppName,
}) => {
  const [apps, setApps] = React.useState<ConnectedApp[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fn = async () => {
      try {
        setIsLoading(true);
        const apps = await getApps(scope);
        setApps(apps);
      } finally {
        setIsLoading(false);
      }
    };

    fn();
  }, [scope]);

  React.useEffect(() => {
    setAppName?.(apps?.find((app) => app._id === value)?.name);
  }, [apps, value]);

  const appValues = (apps: ConnectedApp[]): IComboboxItem[] =>
    apps
      .filter(({ _id }) => !excludeIds?.find((id) => id === _id))
      .map((app) => {
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
      disabled={disabled || isLoading}
      className={cn("flex font-normal text-base max-w-full", className)}
      values={appValues(apps)}
      searchLabel={isLoading ? "Loading apps..." : "Select app"}
      value={value}
      customSearch={(search) =>
        appValues(apps.filter((app) => checkAppSearch(app, search)))
      }
      onItemSelect={onItemSelect}
    />
  );
};
