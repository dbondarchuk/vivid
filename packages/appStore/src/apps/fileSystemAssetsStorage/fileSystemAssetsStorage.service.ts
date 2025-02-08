import { createReadStream, existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import { Readable } from "stream";

import {
  ConnectedAppData,
  IAssetsStorage,
  IConnectedApp,
  IConnectedAppProps,
} from "@vivid/types";

export default class FileSystemAssetsStorageConnectedApp
  implements IConnectedApp, IAssetsStorage
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(): Promise<void> {
    // do nothing
  }

  public async getFile(
    appData: ConnectedAppData,
    filename: string
  ): Promise<Readable> {
    const filepath = this.getFilePath(filename);
    return createReadStream(filepath);
  }

  public async saveFile(
    appData: ConnectedAppData,
    filename: string,
    file: Buffer
  ): Promise<void> {
    const filepath = this.getFilePath(filename);
    fs.writeFile(filepath, file);
  }

  public async deleteFile(
    appData: ConnectedAppData,
    filename: string
  ): Promise<void> {
    const filepath = this.getFilePath(filename);
    if (!existsSync(filepath)) return;

    await fs.rm(filepath);
  }

  public async deleteFiles(
    appData: ConnectedAppData,
    filenames: string[]
  ): Promise<void> {
    for (const filename of filenames) {
      const filepath = this.getFilePath(filename);
      if (!existsSync(filepath)) return;

      await fs.rm(filepath);
    }
  }

  public async checkExists(
    appData: ConnectedAppData,
    filename: string
  ): Promise<boolean> {
    return existsSync(this.getFilePath(filename));
  }

  private getFilePath(filename: string) {
    return path.join(process.cwd(), "public", "upload", filename);
  }
}
