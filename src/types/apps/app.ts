import { icons } from "lucide-react";
import type { ReactNode } from "react";

export type AppScope =
  | "calendar-read"
  | "calendar-write"
  | "mail-send"
  | "text-message-send"
  | "appointment-hook"
  | "scheduled";

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
  isHidden?: boolean;
  SetUp: (props: ComplexAppSetupProps) => ReactNode;
  menuItem: {
    parent?: string;
    id: string;
    label: string;
    href: string;
    icon: keyof typeof icons;
  };
};

export type App = OAuthApp | BasicApp | ComplexApp;
