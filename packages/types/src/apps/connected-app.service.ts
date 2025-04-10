import { IServicesContainer } from "../services";
import {
  ConnectedAppData,
  ConnectedAppResponse,
  ConnectedAppUpdateModel,
} from "./connected-app.data";

import type { Db } from "mongodb";

export interface ApiRequest extends Request {
  // query: Partial<{
  //   [key: string]: string | string[];
  // }>;
  // cookies: Partial<{
  //   [key: string]: string;
  // }>;
  // body: any;
}

export interface ApiResponse extends Response {}
// type Send<T> = (body: T) => void;
// export interface ApiResponse<Data = any> {
//   send: Send<Data>;
//   json: Send<Data>;
//   status: (statusCode: number) => ApiResponse<Data>;
//   redirect(url: string): ApiResponse<Data>;
//   redirect(status: number, url: string): ApiResponse<Data>;
// }

export interface IConnectedApp {
  processRequest: (appData: ConnectedAppData, data: any) => Promise<any>;
  unInstall?: (appData: ConnectedAppData) => Promise<void>;
}

export interface IConnectedAppWithWebhook extends IConnectedApp {
  processWebhook(
    appData: ConnectedAppData,
    request: ApiRequest
  ): Promise<ApiResponse>;
}

export interface IOAuthConnectedApp extends IConnectedApp {
  getLoginUrl: (appId: string) => Promise<string>;
  processRedirect: (
    request: ApiRequest,
    data?: any
  ) => Promise<ConnectedAppResponse>;
}

export type IConnectedAppProps = {
  update: (updateMode: ConnectedAppUpdateModel) => Promise<void>;
  services: IServicesContainer;
  getDbConnection: () => Promise<Db>;
};
