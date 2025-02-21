import { Readable } from "stream";
import { Asset, AssetUpdate } from "../assets";
import { Query, WithTotal } from "../database";

export interface IAssetsService {
  getAsset(_id: string): Promise<Asset | null>;
  getAssets(
    query: Query & {
      accept?: string[];
    }
  ): Promise<WithTotal<Asset>>;
  createAsset(
    asset: Omit<Asset, "_id" | "uploadedAt" | "size">,
    file: Buffer
  ): Promise<Asset>;
  updateAsset(id: string, update: AssetUpdate): Promise<void>;
  deleteAsset(id: string): Promise<Asset | undefined>;
  deleteAssets(ids: string[]): Promise<Asset[]>;
  checkUniqueFileName(filename: string, _id?: string): Promise<boolean>;
  streamAsset(
    filename: string
  ): Promise<{ stream: Readable; asset: Asset } | null>;
}
