import type { IncomingMessage } from "http";

import { IServicesContainer } from "../services";
import {
  ConnectedAppData,
  ConnectedAppResponse,
  ConnectedAppUpdateModel,
} from "./connectedApp.data";

export interface ApiRequest extends IncomingMessage {
  query: Partial<{
    [key: string]: string | string[];
  }>;
  cookies: Partial<{
    [key: string]: string;
  }>;
  body: any;
}

type Send<T> = (body: T) => void;
export interface ApiResponse<Data = any> {
  send: Send<Data>;
  json: Send<Data>;
  status: (statusCode: number) => ApiResponse<Data>;
  redirect(url: string): ApiResponse<Data>;
  redirect(status: number, url: string): ApiResponse<Data>;
}

export interface IConnectedApp {
  processRequest: (appData: ConnectedAppData, data: any) => Promise<any>;
  processWebhook(
    appData: ConnectedAppData,
    request: ApiRequest,
    result: ApiResponse
  ): Promise<void>;
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
};
