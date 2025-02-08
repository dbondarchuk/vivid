import {
  ApiRequest,
  ApiResponse,
  App,
  AppScope,
  ConnectedApp,
  ConnectedAppData,
  ConnectedAppUpdateModel,
  IConnectedApp,
  IConnectedAppProps,
} from "../apps";

export interface IConnectedAppService {
  createNewApp(name: string): Promise<string>;
  deleteApp(appId: string): Promise<void>;
  updateApp(appId: string, updateModel: ConnectedAppUpdateModel): Promise<void>;
  requestLoginUrl(appId: string): Promise<string>;
  processRedirect(name: string, request: ApiRequest, data?: any): Promise<void>;
  processWebhook(
    appId: string,
    request: ApiRequest
  ): Promise<ApiResponse | undefined>;
  processRequest(appId: string, data: any): Promise<any>;
  getAppStatus(appId: string): Promise<ConnectedApp>;
  getApps(): Promise<ConnectedApp[]>;
  getAppsByScope(...scope: AppScope[]): Promise<ConnectedApp[]>;
  getAppsByApp(appName: string): Promise<ConnectedApp[]>;
  getAppsByScopeWithData(...scope: AppScope[]): Promise<ConnectedAppData[]>;
  getAppsByType(type: App["type"]): Promise<{ id: string; name: string }[]>;
  getApp(appId: string): Promise<ConnectedAppData>;
  getAppsData(appIds: string[]): Promise<ConnectedAppData[]>;
  getAppService<T>(
    appId: string
  ): Promise<{ service: IConnectedApp & T; app: ConnectedApp }>;
  getAppServiceProps(appId: string): IConnectedAppProps;
}
