import {
  appStatusText,
  appStatusTextClasses,
  AvailableApps,
} from "@vivid/app-store";
import { ConnectedApp } from "@vivid/types";
import { cn } from "@vivid/ui";

export type ConnectedAppPropertiesProps<T extends keyof ConnectedApp> = {
  className?: string;
  app: Pick<ConnectedApp, T>;
};

export const ConnectedAppAccount: React.FC<
  ConnectedAppPropertiesProps<"account">
> = ({ app, className }) => {
  const parts = [
    (app?.account as any)?.serverUrl,
    app?.account?.username,
    app?.account?.additional,
  ].filter((p) => !!p);

  return parts.length > 0 ? (
    <span className={cn("text-sm text-muted-foreground", className)}>
      {parts.join(" / ")}
    </span>
  ) : (
    <span />
  );
};

export const ConnectedAppStatusMessage: React.FC<
  ConnectedAppPropertiesProps<"status" | "statusText">
> = ({ app, className }) => (
  <div className={cn("break-all", appStatusTextClasses[app.status], className)}>
    Status: {appStatusText[app.status]}, {app.statusText}
  </div>
);

export const ConnectedAppNameAndLogo: React.FC<
  ConnectedAppPropertiesProps<"name"> & {
    logoClassName?: string;
    nameClassName?: string;
  }
> = ({ app, className, logoClassName, nameClassName }) => {
  const App = AvailableApps[app.name];
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <App.Logo className={cn("w-6 y-6", logoClassName)} />
      <span className={nameClassName}>{App.displayName}</span>
    </div>
  );
};
