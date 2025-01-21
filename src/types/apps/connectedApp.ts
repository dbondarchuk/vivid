import { NextRequest } from "next/server";

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

export interface IConnectedApp {
  processRequest: (data: any) => Promise<any>;
}

export interface IOAuthConnectedApp extends IConnectedApp {
  getLoginUrl: (appId: string, baseUrl: string) => Promise<string>;
  processRedirect: (
    request: NextRequest,
    baseUrl: string,
    data?: any
  ) => Promise<ConnectedAppResponse>;
}

export type IConnectedAppProps = {
  update: (updateMode: ConnectedAppUpdateModel) => Promise<void>;
};

export type ConnectedOauthAppTokens = {
  accessToken: string;
  refreshToken: string;
  expiresOn: Date | undefined | null;
};

export type ConnectedAppAccount = {
  username: string;
};

export type ConnectedAppStatusWithText = {
  status: ConnectedAppStatus;
  statusText: string;
};

export type ConnectedAppData = {
  _id: string;
  name: string;
  status: ConnectedAppStatus;
  statusText: string;
  account?: ConnectedAppAccount;
  data?: any;
};

export type ConnectedAppUpdateModel = Partial<
  Omit<ConnectedAppData, "_id" | "name">
>;

export type ConnectedApp = Omit<ConnectedAppData, "data">;
