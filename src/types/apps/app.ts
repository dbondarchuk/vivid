import type { ReactNode } from "react";
import { ConnectedAppStatus } from "./connectedApp";

export type AppScope = "calendar-read" | "calendar-write" | "mail-send";

export type AppSetupProps = {
  setIsLoading: (isLoading: boolean) => void;
  onStatusChange: (status: ConnectedAppStatus, statusText: string) => void;
  onSuccess: () => void;
  onError: (error: string) => void;
  appId?: string;
};

export type AppLogoProps = {
  className?: string;
};

export type App = {
  name: string;
  displayName: string;
  scope: AppScope[];
  Logo: (props: AppLogoProps) => ReactNode;
  SetUp: (props: AppSetupProps) => ReactNode;
  type: "oauth" | string;
};
