import { AvailableApps } from "@vivid/app-store";
import { AvailableAppServices } from "@vivid/app-store/services";
import { getLoggerFactory } from "@vivid/logger";
import {
  ApiRequest,
  App,
  AppScope,
  ConnectedApp,
  ConnectedAppData,
  ConnectedAppUpdateModel,
  IConnectedApp,
  IConnectedAppProps,
  IConnectedAppsService,
  IConnectedAppWithWebhook,
  IOAuthConnectedApp,
} from "@vivid/types";
import { ObjectId } from "mongodb";
import { ServicesContainer } from ".";
import { getDbConnection } from "./database";

export const CONNECTED_APPS_COLLECTION_NAME = "connected-apps";

export class ConnectedAppsService implements IConnectedAppsService {
  protected readonly loggerFactory = getLoggerFactory("ConnectedAppsService");

  public async createNewApp(name: string): Promise<string> {
    const logger = this.loggerFactory("createNewApp");
    logger.debug({ name }, "Creating new app");

    if (!AvailableApps[name]) {
      logger.error({ name }, "Unknown app type");
      throw new Error("Unknown app type");
    }

    const app: ConnectedAppData = {
      _id: new ObjectId().toString(),
      status: "pending",
      statusText: "Pending",
      name,
    };

    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    await collection.insertOne(app);

    logger.debug({ name, appId: app._id }, "Successfully created new app");

    return app._id;
  }

  public async deleteApp(appId: string): Promise<void> {
    const logger = this.loggerFactory("deleteApp");
    logger.debug({ appId }, "Deleting app");
    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    const { app, service } = await this.getAppService(appId);
    if (service.unInstall) {
      logger.debug({ appId, appName: app.name }, "Running uninstall");
      await service.unInstall(app);
    }

    await collection.deleteOne({
      _id: appId,
    });

    logger.debug({ appId, appName: app.name }, "Successfully deleted app");
  }

  public async updateApp(appId: string, updateModel: ConnectedAppUpdateModel) {
    const logger = this.loggerFactory("updateApp");
    logger.debug({ appId }, "Updating app");

    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    const app = await collection.findOne({
      _id: appId,
    });

    if (!app) {
      logger.error({ appId }, "App not found");
      throw new Error("App not found");
    }

    await collection.updateOne(
      {
        _id: appId,
      },
      {
        $set: {
          ...updateModel,
        },
      }
    );

    logger.debug({ appId, appName: app.name }, "Successfully updated app");
  }

  public async requestLoginUrl(appId: string): Promise<string> {
    const logger = this.loggerFactory("requestLoginUrl");
    logger.debug({ appId }, "Requesting login URL");

    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    const app = await collection.findOne({
      _id: appId,
    });

    if (!app) {
      const message = "App not found";
      logger.error({ appId }, message);
      throw new Error(message);
    }

    const appService = AvailableApps[app.name];
    if (!appService || appService.type !== "oauth") {
      const message = "App type is not supported";
      logger.error(
        { appId, appName: app.name, appType: appService.type },
        message
      );
      throw new Error(message);
    }

    const service = AvailableAppServices[app.name](
      this.getAppServiceProps(appId)
    );

    const loginUrl = await (service as any as IOAuthConnectedApp).getLoginUrl(
      appId
    );

    logger.debug({ appId, appName: app.name }, "Successfully got login URL");

    return loginUrl;
  }

  public async processRedirect(name: string, request: ApiRequest, data?: any) {
    const logger = this.loggerFactory("processRedirect");
    logger.debug(
      { name, request: { method: request.method, url: request.url } },
      "Processing OAuth redirect"
    );

    const appService = AvailableApps[name];
    if (!appService || appService.type !== "oauth") {
      logger.error({ name }, "App type is not supported");
      throw new Error("App type is not supported");
    }

    const service = AvailableAppServices[name](this.getAppServiceProps(""));

    const result = await (service as any as IOAuthConnectedApp).processRedirect(
      request,
      data
    );

    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    const app = await collection.findOne({
      _id: result.appId,
    });

    if (!app) {
      logger.error({ appId: result.appId }, "App not found");
      throw new Error("App not found");
    }

    if ("error" in result) {
      logger.error(
        { appId: result.appId, error: result.error },
        "OAuth redirect failed"
      );

      await collection.updateOne(
        {
          _id: result.appId,
        },
        {
          $set: {
            status: "failed",
            statusText: result.error,
          },
        }
      );
    } else {
      logger.debug({ appId: result.appId }, "OAuth redirect successful");
      await collection.updateOne(
        {
          _id: result.appId,
        },
        {
          $set: {
            status: "connected",
            statusText: "connected",
            data: result.data,
            account: result.account,
          },
        }
      );
    }

    logger.debug(
      { appId: result.appId },
      "OAuth redirect processing completed"
    );
  }

  public async processWebhook(appId: string, request: ApiRequest) {
    const logger = this.loggerFactory("processWebhook");
    logger.debug(
      { appId, request: { method: request.method, url: request.url } },
      "Processing webhook"
    );

    const app = await this.getApp(appId);
    const appService = AvailableAppServices[app.name](
      this.getAppServiceProps(appId)
    ) as IConnectedAppWithWebhook;

    if (!("processWebhook" in appService)) {
      logger.debug(
        { appId, appName: app.name },
        "App does not process webhooks"
      );
      return Response.json(
        {
          error: `App ${app.name} does not process webhooks`,
        },
        { status: 405 }
      );
    }

    const result = await appService.processWebhook(app, request);
    logger.debug({ appId }, "Returning webhook response");
    return result;
  }

  public async processAppCall(
    appId: string,
    slug: string[],
    request: ApiRequest
  ) {
    const logger = this.loggerFactory("processAppCall");
    logger.debug(
      { appId, slug, request: { method: request.method, url: request.url } },
      "Processing app call"
    );

    const app = await this.getApp(appId);
    const appService = AvailableAppServices[app.name](
      this.getAppServiceProps(appId)
    ) as IConnectedAppWithWebhook;

    if (!("processAppCall" in appService) || !appService.processAppCall) {
      logger.debug(
        { appId, appName: app.name },
        "App does not process app calls"
      );
      return Response.json(
        {
          error: `App ${app.name} does not process app calls`,
        },
        { status: 405 }
      );
    }

    const result = await appService.processAppCall(app, slug, request);
    logger.debug({ appId, slug }, "Returning app call response");

    return result;
  }

  public async processRequest(appId: string, data: any): Promise<any> {
    const logger = this.loggerFactory("processRequest");
    logger.debug({ appId, data }, "Processing request");
    const app = await this.getApp(appId);

    const appService = AvailableAppServices[app.name](
      this.getAppServiceProps(appId)
    );

    if (!appService.processRequest) {
      logger.error(
        { appId, appName: app.name },
        "App does not implement processRequest"
      );

      throw new Error(`App ${app.name} does not implement processRequest`);
    }

    const result = await appService.processRequest(app, data);

    logger.debug({ appId }, "Returning request response");
    return result;
  }

  public async processStaticRequest(appName: string, data: any): Promise<any> {
    const logger = this.loggerFactory("processStaticRequest");
    logger.debug({ appName }, "Processing static request");
    const appService = AvailableAppServices[appName](
      this.getAppServiceStaticProps(appName)
    );

    if (!appService.processStaticRequest) {
      logger.error({ appName }, "App does not support static requests");
      throw new Error(`App ${appName} does not support static requests`);
    }

    logger.debug({ appName }, "Returning static request response");
    return await appService.processStaticRequest(data);
  }

  public async getAppStatus(appId: string): Promise<ConnectedApp> {
    const logger = this.loggerFactory("getAppStatus");
    logger.debug({ appId }, "Getting app status");
    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    const result = await collection.findOne({
      _id: appId,
    });

    if (!result) {
      logger.error({ appId }, "App not found");
      throw new Error("App not found");
    }

    const { data: __, token: ____, ...app } = result;

    logger.debug({ appId }, "Returning app status");
    return app;
  }

  public async getApps(): Promise<ConnectedApp[]> {
    const logger = this.loggerFactory("getApps");
    logger.debug({}, "Getting all apps");
    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    const result = await collection.find().toArray();

    logger.debug({ count: result.length }, "Returning all apps");
    return result.map(({ data: __, ...app }) => app);
  }

  public async getAppsByScope(...scope: AppScope[]): Promise<ConnectedApp[]> {
    const logger = this.loggerFactory("getAppsByScope");
    logger.debug({ scope }, "Getting apps by scope");
    const result = await this.getAppsByScopeWithData(...scope);

    logger.debug({ scope, count: result.length }, "Returning apps by scope");
    return result.map(({ data: __, ...app }) => app);
  }

  public async getAppsByApp(appName: string): Promise<ConnectedApp[]> {
    const logger = this.loggerFactory("getAppsByApp");
    logger.debug({ appName }, "Getting apps by app name");
    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    const result = await collection
      .find({
        name: appName,
      })
      .toArray();

    logger.debug(
      { appName, count: result.length },
      "Returning apps by app name"
    );
    return result.map(({ data: __, ...app }) => app);
  }

  public async getAppsByScopeWithData(
    ...scope: AppScope[]
  ): Promise<ConnectedAppData[]> {
    const logger = this.loggerFactory("getAppsByScopeWithData");
    logger.debug({ scope }, "Getting apps by scope with data");
    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    const possibleAppNames = Object.keys(AvailableApps).filter((appName) =>
      AvailableApps[appName].scope.some((s) => scope.includes(s))
    );

    const result = await collection
      .find({
        name: {
          $in: possibleAppNames,
        },
      })
      .toArray();

    logger.debug(
      { scope, count: result.length },
      "Returning apps by scope with data"
    );
    return result;
  }

  public async getAppsByType(type: App["type"]) {
    const logger = this.loggerFactory("getAppsByType");
    logger.debug({ type }, "Getting apps by type");
    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    const possibleAppNames = Object.keys(AvailableApps).filter(
      (appName) => AvailableApps[appName].type === type
    );

    const result = await collection
      .find({
        name: {
          $in: possibleAppNames,
        },
      })
      .map((app) => ({ id: app._id, name: app.name }))
      .toArray();

    logger.debug({ type, count: result.length }, "Returning apps by type");
    return result;
  }

  public async getApp(appId: string): Promise<ConnectedAppData> {
    const logger = this.loggerFactory("getApp");
    logger.debug({ appId }, "Getting app data");
    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    const result = await collection.findOne({
      _id: appId,
    });

    if (!result) {
      logger.error({ appId }, "App not found");
      throw new Error("App not found");
    }

    logger.debug({ appId }, "Returning app data");
    return result;
  }

  public async getAppsData(appIds: string[]): Promise<ConnectedAppData[]> {
    const logger = this.loggerFactory("getAppsData");
    logger.debug({ appIds }, "Getting apps data");
    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    const result = await collection
      .find({
        _id: {
          $in: appIds,
        },
      })
      .toArray();

    logger.debug({ appIds, count: result.length }, "Returning apps data");
    return result;
  }

  public async getAppService<T>(
    appId: string
  ): Promise<{ service: IConnectedApp & T; app: ConnectedApp }> {
    const logger = this.loggerFactory("getAppService");
    logger.debug({ appId }, "Getting app service");
    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    const app = await collection.findOne({
      _id: appId,
    });

    if (!app) {
      logger.error({ appId }, "App not found");
      throw new Error(`App ${appId} was not found`);
    }

    const service = AvailableAppServices[app.name](
      this.getAppServiceProps(appId)
    ) as any as T & IConnectedApp;

    logger.debug({ appId }, "Returning app service");
    return { app, service };
  }

  public getAppServiceProps(appId: string): IConnectedAppProps {
    return {
      update: (updateModel) => this.updateApp(appId, updateModel),
      services: ServicesContainer,
      getDbConnection: getDbConnection,
    };
  }

  public getAppServiceStaticProps(appName: string): IConnectedAppProps {
    const logger = this.loggerFactory("getAppServiceStaticProps");
    logger.debug({ appName }, "Getting app service static props");
    try {
      const appService = AvailableAppServices[appName];
      if (!appService) {
        logger.error({ appName }, "App service not found");
        throw new Error(`App service ${appName} was not found`);
      }

      return {
        update: async (updateModel) => {
          logger.error(
            { appName },
            `App called update method from static request`
          );
          throw new Error(
            `App ${appName} called update method from static request`
          );
        },
        services: ServicesContainer,
        getDbConnection: getDbConnection,
      };
    } catch (error) {
      logger.error(
        { appName, error },
        "Error getting app service static props"
      );
      throw error;
    }
  }
}
