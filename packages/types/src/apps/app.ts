import type { ReactElement, ReactNode } from "react";

export type AppScope =
  | "calendar-read"
  | "calendar-write"
  | "mail-send"
  | "text-message-send"
  | "appointment-hook"
  | "assets-storage"
  | "scheduled"
  | "schedule";

export type AppSetupProps = {
  onSuccess: () => void;
  onError: (error: string) => void;
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
  displayName: string;
  category: string[];
  scope: AppScope[];
  description: {
    text: string;
    images?: string[];
  };
  Logo: (props: AppLogoProps) => ReactNode;
  isFeatured?: boolean;
  menuItems?: {
    parent?: string;
    order?: number;
    id: string;
    label: string;
    href: string;
    icon: ReactElement;
    Page: (props: ComplexAppSetupProps) => ReactNode;
    pageBreadcrumbs?: {
      link: string;
      title: string;
    }[];
    notScrollable?: boolean;
    isHidden?: boolean;
    pageTitle?: string;
    pageDescription?: string;
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
