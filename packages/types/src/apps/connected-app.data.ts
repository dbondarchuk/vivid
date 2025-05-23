export type ConnectedAppStatus = "pending" | "connected" | "failed";

export type ConnectedAppResponse = {
  appId: string;
} & (
  | {
      data: any;
      account: ConnectedAppAccount;
    }
  | {
      error: string;
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

export type ConnectedAppStatusWithText = {
  status: ConnectedAppStatus;
  statusText: string;
};

export type ConnectedAppData<T = any> = ConnectedAppStatusWithText & {
  _id: string;
  name: string;
  account?: ConnectedAppAccount;
  data?: T;
};

export type ConnectedAppUpdateModel = Partial<
  Omit<ConnectedAppData, "_id" | "name">
>;

export type ConnectedApp = Omit<ConnectedAppData, "data">;
