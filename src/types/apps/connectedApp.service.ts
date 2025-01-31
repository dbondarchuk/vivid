import { NextRequest, NextResponse } from "next/server";
import {
  ConnectedAppData,
  ConnectedAppResponse,
  ConnectedAppUpdateModel,
} from "./connectedApp.data";

export interface IConnectedApp {
  processRequest: (appData: ConnectedAppData, data: any) => Promise<any>;
  processWebhook(
    appData: ConnectedAppData,
    request: NextRequest
  ): Promise<NextResponse | void | any>;
}

export interface IOAuthConnectedApp extends IConnectedApp {
  getLoginUrl: (appId: string) => Promise<string>;
  processRedirect: (
    request: NextRequest,
    data?: any
  ) => Promise<ConnectedAppResponse>;
}

export type IConnectedAppProps = {
  update: (updateMode: ConnectedAppUpdateModel) => Promise<void>;
};
