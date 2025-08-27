import { Readable } from "stream";
import { ConnectedAppData } from "../connected-app.data";

export interface IAssetsStorage {
  getFile(appData: ConnectedAppData, filename: string): Promise<Readable>;
  saveFile(
    appData: ConnectedAppData,
    filename: string,
    file: Readable,
    fileLength: number,
  ): Promise<void>;
  deleteFile(appData: ConnectedAppData, filename: string): Promise<void>;
  deleteFiles(appData: ConnectedAppData, filenames: string[]): Promise<void>;
  checkExists(appData: ConnectedAppData, filename: string): Promise<boolean>;
}
