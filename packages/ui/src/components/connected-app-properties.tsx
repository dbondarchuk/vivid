"use client";
import { appStatusTextClasses, AvailableApps } from "@vivid/app-store";
import { useI18n } from "@vivid/i18n";
import { ConnectedApp } from "@vivid/types";
import { cn } from "@vivid/ui";

export const ConnectedAppAccount: React.FC<{
  account: ConnectedApp["account"];
  className?: string;
}> = ({ account, className }) => {
  const parts = [
    (account as any)?.serverUrl,
    account?.username,
    account?.additional,
  ].filter((p) => !!p);

  return parts.length > 0 ? (
    <span className={cn("text-sm text-muted-foreground", className)}>
      {parts.join(" / ")}
    </span>
  ) : (
    <span />
  );
};

export const ConnectedAppStatusMessage: React.FC<{
  status: ConnectedApp["status"];
  statusText: ConnectedApp["statusText"];
  className?: string;
}> = ({ status, statusText, className }) => {
  const t = useI18n("apps");
  return (
    <div className={cn("break-all", appStatusTextClasses[status], className)}>
      {t("common.statusMessage", {
        status: t(`status.${status}`),
        statusText:
          typeof statusText === "string"
            ? t(statusText)
            : t(statusText.key, statusText.args),
      })}
    </div>
  );
};

export const ConnectedAppNameAndLogo: React.FC<{
  appName: ConnectedApp["name"];
  className?: string;
  logoClassName?: string;
  nameClassName?: string;
}> = ({ appName, className, logoClassName, nameClassName }) => {
  const App = AvailableApps[appName];
  const t = useI18n("apps");
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <App.Logo className={cn("w-6 y-6", logoClassName)} />
      <span className={nameClassName}>{t(App.displayName)}</span>
    </div>
  );
};
