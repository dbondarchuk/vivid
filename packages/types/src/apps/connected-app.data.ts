import { AppsKeys } from "@vivid/i18n";

export type ConnectedAppStatus = "pending" | "connected" | "failed";

export type ConnectedAppResponse = {
  appId: string;
} & (
  | {
      data?: any;
      token?: any;
      account: ConnectedAppAccount;
    }
  | {
      error: AppsKeys;
      errorArgs?: Record<string, any>;
    }
);

export type ConnectedOauthAppTokens = {
  accessToken: string;
  refreshToken: string;
  expiresOn: Date | undefined | null;
};

export type ConnectedAppAccount = (
  | {
      username: string;
    }
  | {
      username?: string;
      serverUrl: string;
    }
) & {
  additional?: string;
};

export class ConnectedAppError extends Error {
  constructor(
    public readonly key: AppsKeys,
    public readonly args?: Record<string, any>,
    message?: string
  ) {
    super(message || key);
  }
}

export type ConnectedAppStatusWithText = {
  status: ConnectedAppStatus;
  statusText:
    | AppsKeys
    | {
        key: AppsKeys;
        args?: Record<string, any>;
      };
};

export type ConnectedAppData<
  TData = any,
  TToken = any,
> = ConnectedAppStatusWithText & {
  _id: string;
  name: string;
  account?: ConnectedAppAccount;
  token?: TToken;
  data?: TData;
};

export type ConnectedAppUpdateModel = Partial<
  Omit<ConnectedAppData, "_id" | "name">
>;

export type ConnectedApp = Omit<ConnectedAppData, "data">;
