import type { AdminKeys, AppsKeys } from "@vivid/i18n";
import type { ReactElement, ReactNode } from "react";

export type AppScope =
  | "calendar-read"
  | "calendar-write"
  | "mail-send"
  | "text-message-send"
  | "text-message-respond"
  | "appointment-hook"
  | "assets-storage"
  | "scheduled"
  | "schedule"
  | "payment";

export type AppSetupProps = {
  onSuccess: () => void;
  onError: (
    error: string | { key: string; args?: Record<string, any> }
  ) => void;
  appId?: string;
};

export type ComplexAppSetupProps = {
  appId: string;
};

export type AppLogoProps = {
  className?: string;
};

type BaseApp = {
  name: string;
  displayName: AppsKeys;
  category: AppsKeys[];
  scope: AppScope[];
  description: {
    text: AppsKeys;
    images?: string[];
  };
  Logo: (props: AppLogoProps) => ReactNode;
  isFeatured?: boolean;
  menuItems?: {
    parent?: string;
    order?: number;
    id: string;
    label: AdminKeys;
    href: string;
    icon: ReactElement;
    Page: (props: ComplexAppSetupProps) => ReactNode;
    pageBreadcrumbs?: {
      link: string;
      title: AppsKeys;
    }[];
    notScrollable?: boolean;
    isHidden?: boolean;
    pageTitle?: AppsKeys;
    pageDescription?: AppsKeys;
  }[];
};

export type OAuthApp = BaseApp & {
  type: "oauth";
  SetUp: (props: AppSetupProps) => ReactNode;
  dontAllowMultiple?: false;
  isHidden?: false;
};

export type BasicApp = BaseApp & {
  type: "basic";
  SetUp: (props: AppSetupProps) => ReactNode;
  dontAllowMultiple?: boolean;
  isHidden?: boolean;
};

export type ComplexApp = BaseApp & {
  type: "complex";
  dontAllowMultiple: true;
  settingsHref?: string;
  isHidden?: boolean;
};

export type SystemApp = BaseApp & {
  type: "system";
  dontAllowMultiple: true;
  isHidden?: true;
};

export type App = OAuthApp | BasicApp | ComplexApp | SystemApp;
