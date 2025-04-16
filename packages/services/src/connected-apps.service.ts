import { AvailableApps } from "@vivid/app-store";
import { AvailableAppServices } from "@vivid/app-store/services";
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
  public async createNewApp(name: string): Promise<string> {
    if (!AvailableApps[name]) {
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

    return app._id;
  }

  public async deleteApp(appId: string): Promise<void> {
    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    const { app, service } = await this.getAppService(appId);
    if (service.unInstall) {
      await service.unInstall(app);
    }

    await collection.deleteOne({
      _id: appId,
    });
  }

  public async updateApp(appId: string, updateModel: ConnectedAppUpdateModel) {
    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    const app = await collection.findOne({
      _id: appId,
    });

    if (!app) {
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
  }

  public async requestLoginUrl(appId: string): Promise<string> {
    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    const app = await collection.findOne({
      _id: appId,
    });

    if (!app) {
      throw new Error("App not found");
    }

    const appService = AvailableApps[app.name];
    if (!appService || appService.type !== "oauth") {
      throw new Error("App type is not supported");
    }

    const service = AvailableAppServices[app.name](
      this.getAppServiceProps(appId)
    );

    return await (service as any as IOAuthConnectedApp).getLoginUrl(appId);
  }

  public async processRedirect(name: string, request: ApiRequest, data?: any) {
    const appService = AvailableApps[name];
    if (!appService || appService.type !== "oauth") {
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
      throw new Error("App not found");
    }

    if ("error" in result) {
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
  }

  public async processWebhook(appId: string, request: ApiRequest) {
    const app = await this.getApp(appId);
    const appService = AvailableAppServices[app.name](
      this.getAppServiceProps(appId)
    ) as IConnectedAppWithWebhook;

    if (!("processWebhook" in appService)) {
      return Response.json(
        {
          error: `App ${app.name} does not process webhooks`,
        },
        { status: 405 }
      );
    }

    return await appService.processWebhook(app, request);
  }

  public async processRequest(appId: string, data: any): Promise<any> {
    const app = await this.getApp(appId);

    const appService = AvailableAppServices[app.name](
      this.getAppServiceProps(appId)
    );

    if (!appService.processRequest) {
      throw new Error(`App ${app.name} does not implement processRequest`);
    }

    return await appService.processRequest(app, data);
  }

  public async processStaticRequest(appName: string, data: any): Promise<any> {
    const appService = AvailableAppServices[appName](
      this.getAppServiceStaticProps(appName)
    );

    if (!appService.processStaticRequest) {
      throw new Error(`App ${appName} does not support static requests`);
    }

    return await appService.processStaticRequest(data);
  }

  public async getAppStatus(appId: string): Promise<ConnectedApp> {
    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    const result = await collection.findOne({
      _id: appId,
    });

    if (!result) {
      throw new Error("App not found");
    }

    const { data: __, ...app } = result;

    return app;
  }

  public async getApps(): Promise<ConnectedApp[]> {
    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    const result = await collection.find().toArray();

    return result.map(({ data: __, ...app }) => app);
  }

  public async getAppsByScope(...scope: AppScope[]): Promise<ConnectedApp[]> {
    const result = await this.getAppsByScopeWithData(...scope);

    return result.map(({ data: __, ...app }) => app);
  }

  public async getAppsByApp(appName: string): Promise<ConnectedApp[]> {
    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    const result = await collection
      .find({
        name: appName,
      })
      .toArray();

    return result.map(({ data: __, ...app }) => app);
  }

  public async getAppsByScopeWithData(
    ...scope: AppScope[]
  ): Promise<ConnectedAppData[]> {
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

    return result;
  }

  public async getAppsByType(type: App["type"]) {
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

    return result;
  }

  public async getApp(appId: string): Promise<ConnectedAppData> {
    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    const result = await collection.findOne({
      _id: appId,
    });

    if (!result) {
      throw new Error("App not found");
    }

    return result;
  }

  public async getAppsData(appIds: string[]): Promise<ConnectedAppData[]> {
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

    return result;
  }

  public async getAppService<T>(
    appId: string
  ): Promise<{ service: IConnectedApp & T; app: ConnectedApp }> {
    const db = await getDbConnection();
    const collection = db.collection<ConnectedAppData>(
      CONNECTED_APPS_COLLECTION_NAME
    );

    const app = await collection.findOne({
      _id: appId,
    });

    if (!app) {
      throw new Error(`App ${appId} was not found`);
    }

    const service = AvailableAppServices[app.name](
      this.getAppServiceProps(appId)
    ) as any as T & IConnectedApp;

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
    return {
      update: async (updateModel) => {
        console.error(
          `App ${appName} called update method from static request`
        );
      },
      services: ServicesContainer,
      getDbConnection: getDbConnection,
    };
  }
}
