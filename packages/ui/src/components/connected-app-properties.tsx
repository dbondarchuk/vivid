import { appStatusTextClasses, AvailableApps } from "@vivid/app-store";
import { I18nFn } from "@vivid/i18n";
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
  ConnectedAppPropertiesProps<"status" | "statusText"> & {
    t: I18nFn<"apps">;
  }
> = ({ app, className, t }) => (
  <div className={cn("break-all", appStatusTextClasses[app.status], className)}>
    {t("common.statusMessage", {
      status: t(`status.${app.status}`),
      statusText:
        typeof app.statusText === "string"
          ? t(app.statusText)
          : t(app.statusText.key, app.statusText.args),
    })}
  </div>
);

export const ConnectedAppNameAndLogo: React.FC<
  ConnectedAppPropertiesProps<"name"> & {
    logoClassName?: string;
    nameClassName?: string;
    t: I18nFn<"apps">;
  }
> = ({ app, className, logoClassName, nameClassName, t }) => {
  const App = AvailableApps[app.name];
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <App.Logo className={cn("w-6 y-6", logoClassName)} />
      <span className={nameClassName}>{t(App.displayName)}</span>
    </div>
  );
};
