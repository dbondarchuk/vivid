import { InstalledApps } from "@/apps";
import { appStatusText, appStatusTextClasses } from "@/apps/apps.const";
import { cn } from "@/lib/utils";
import { ConnectedApp } from "@/types";

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
  ].filter((p) => !!p);

  return parts.length > 0 ? (
    <span className={cn("text-sm text-muted-foreground", className)}>
      {parts.join(" / ")}
    </span>
  ) : null;
};

export const ConnectedAppStatusMessage: React.FC<
  ConnectedAppPropertiesProps<"status" | "statusText">
> = ({ app, className }) => (
  <div className={cn("break-all", appStatusTextClasses[app.status], className)}>
    Status: {appStatusText[app.status]}, {app.statusText}
  </div>
);

export const ConnectedAppNameAndLogo: React.FC<
  ConnectedAppPropertiesProps<"name">
> = ({ app, className }) => {
  const App = InstalledApps[app.name];
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <App.Logo className="w-6 y-6" />
      <span>{App.displayName}</span>
    </div>
  );
};
