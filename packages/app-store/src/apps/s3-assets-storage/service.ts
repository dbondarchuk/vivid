import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import {
  ConnectedAppData,
  ConnectedAppStatusWithText,
  IAssetsStorage,
  IConnectedApp,
  IConnectedAppProps,
} from "@vivid/types";
import { maskify } from "@vivid/utils";
import { Readable } from "stream";
import { S3Configuration } from "./models";

const DEFAULT_BUCKET_NAME = "assets";

export default class S3AssetsStorageConnectedApp
  implements IConnectedApp, IAssetsStorage
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData,
    data: S3Configuration
  ): Promise<ConnectedAppStatusWithText> {
    let success = false;
    let error: string | undefined = undefined;

    try {
      const client = this.getClient(data);
      const bucket = this.getBucketName(data);

      try {
        const response = await client.send(
          new HeadBucketCommand({ Bucket: bucket })
        );
      } catch (error: any) {
        if (error?.name === "NotFound") {
          await client.send(new CreateBucketCommand({ Bucket: bucket }));
        } else {
          throw error;
        }
      }

      const status: ConnectedAppStatusWithText = {
        status: "connected",
        statusText: `Bucket successfully created`,
      };

      this.props.update({
        account: {
          username: `${data.region} / ${maskify(data.accessKeyId)}`,
          serverUrl: data.endpoint,
        },
        data,
        ...status,
      });

      return status;
    } catch (e: any) {
      const status: ConnectedAppStatusWithText = {
        status: "failed",
        statusText: e?.message || e?.toString() || "Something went wrong",
      };

      this.props.update({
        ...status,
      });

      return status;
    }
  }

  public async getFile(
    appData: ConnectedAppData,
    filename: string
  ): Promise<Readable> {
    const client = this.getClient(appData.data);

    try {
      const response = await client.send(
        new GetObjectCommand({
          Bucket: this.getBucketName(appData.data),
          Key: filename,
        })
      );

      if (!response.Body) throw new Error("No body present");
      return response.Body as Readable;
    } catch (error: any) {
      if (error?.name === "NotFound") {
        throw new Error(`File ${filename} was not found`);
      }

      throw error;
    }
  }

  public async saveFile(
    appData: ConnectedAppData,
    filename: string,
    file: Readable,
    fileLength: number
  ): Promise<void> {
    const client = this.getClient(appData.data);
    await client.send(
      new PutObjectCommand({
        Bucket: this.getBucketName(appData.data),
        Key: filename,
        Body: file,
        ContentLength: fileLength,
      })
    );
  }

  public async deleteFile(
    appData: ConnectedAppData,
    filename: string
  ): Promise<void> {
    const client = this.getClient(appData.data);

    const exists = await this.checkExists(appData.data, filename);
    if (!exists) return;

    await client.send(
      new DeleteObjectCommand({
        Bucket: this.getBucketName(appData.data),
        Key: filename,
      })
    );
  }

  public async deleteFiles(
    appData: ConnectedAppData,
    filenames: string[]
  ): Promise<void> {
    await Promise.all(
      filenames.map((filename) => this.deleteFile(appData, filename))
    );
  }

  public async checkExists(
    appData: ConnectedAppData,
    filename: string
  ): Promise<boolean> {
    const client = this.getClient(appData.data);

    try {
      await client.send(
        new HeadObjectCommand({
          Bucket: this.getBucketName(appData.data),
          Key: filename,
        })
      );

      return true;
    } catch (error: any) {
      if (error?.name === "NotFound") return false;
      throw error;
    }
  }

  private getClient(data: S3Configuration) {
    if (!data || !data.region || !data.accessKeyId || !data.secretAccessKey) {
      throw new Error("Invalid configuration");
    }

    return new S3Client({
      region: data.region,
      credentials: {
        accessKeyId: data.accessKeyId,
        secretAccessKey: data.secretAccessKey,
      },
      endpoint: data.endpoint,
      forcePathStyle: data.forcePathStyle,
    });
  }

  private getBucketName(data: S3Configuration) {
    return data?.bucket ?? DEFAULT_BUCKET_NAME;
  }
}
