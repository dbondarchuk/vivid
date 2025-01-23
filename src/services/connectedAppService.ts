import { InstalledApps } from "@/apps";
import { InstalledAppServices } from "@/apps/apps.services";
import { getDbConnection } from "@/database";
import {
  ConnectedApp,
  ConnectedAppData,
  ConnectedAppUpdateModel,
  IConnectedApp,
  IConnectedAppProps,
  IOAuthConnectedApp,
} from "@/types";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export const CONNECTED_APPS_COLLECTION_NAME = "connected_apps";

export class ConnectedAppService {
  public async createNewApp(name: string): Promise<string> {
    if (!InstalledApps[name]) {
      throw new Error("Unknown app type");
    }

    const app: ConnectedAppData = {
      _id: new ObjectId().toString(),
      status: "pending",
      statusText: "Pending authorization",
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

  public async requestLoginUrl(
    appId: string,
    baseUrl: string
  ): Promise<string> {
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

    const service = InstalledApps[app.name];
    if (!service || service.type !== "oauth") {
      throw new Error("App type is not supported");
    }

    const appService = InstalledAppServices[app.name](
      this.getAppServiceProps(appId)
    );

    return await (appService as IOAuthConnectedApp).getLoginUrl(appId, baseUrl);
  }

  public async processRedirect(
    name: string,
    request: NextRequest,
    baseUrl: string,
    data?: any
  ) {
    const service = InstalledApps[name];
    if (!service || service.type !== "oauth") {
      throw new Error("App type is not supported");
    }

    const appService = InstalledAppServices[name](this.getAppServiceProps(""));
    const result = await (appService as IOAuthConnectedApp).processRedirect(
      request,
      baseUrl,
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

  public async processWebhook(appId: string, request: NextRequest) {
    const app = await this.getApp(appId);
    const appService = InstalledAppServices[app.name](
      this.getAppServiceProps(appId)
    );

    return await appService.processWebhook(app, request);
  }

  public async processRequest(appId: string, data: any): Promise<any> {
    const app = await this.getApp(appId);

    const appService = InstalledAppServices[app.name](
      this.getAppServiceProps(appId)
    );

    return await appService.processRequest(app, data);
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

    if (!result) {
      throw new Error("App not found");
    }

    return result;
  }

  public async getAppService(
    appId: string
  ): Promise<{ service: IConnectedApp; app: ConnectedApp }> {
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

    const service = InstalledAppServices[app.name](
      this.getAppServiceProps(appId)
    );
    return { app, service };
  }

  public getAppServiceProps(appId: string): IConnectedAppProps {
    return {
      update: (updateModel) => this.updateApp(appId, updateModel),
    };
  }
}
