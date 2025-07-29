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

export interface IConnectedApp<TData = any, TToken = any> {
  processAppData?: (
    appData: NonNullable<ConnectedAppData<TData, TToken>["data"]>
  ) => Promise<NonNullable<ConnectedAppData<TData, TToken>["data"]>>;
  processRequest?: (
    appData: ConnectedAppData<TData, TToken>,
    data: any
  ) => Promise<any>;
  processStaticRequest?: (data: any) => Promise<any>;
  unInstall?: (appData: ConnectedAppData<TData, TToken>) => Promise<void>;
  processAppCall?: (
    appData: ConnectedAppData<TData, TToken>,
    slug: string[],
    request: ApiRequest
  ) => Promise<ApiResponse | undefined>;
}

export interface IConnectedAppWithWebhook<TData = any, TToken = any>
  extends IConnectedApp<TData, TToken> {
  processWebhook(
    appData: ConnectedAppData<TData, TToken>,
    request: ApiRequest
  ): Promise<ApiResponse>;
}

export interface IOAuthConnectedApp<TData = any, TToken = any>
  extends IConnectedApp<TData, TToken> {
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
