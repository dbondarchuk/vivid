"use server";

import { ServicesContainer } from "@vivid/services";
import { AssetEntity, AssetUpdate, okStatus } from "@vivid/types";
import { notFound } from "next/navigation";

export async function createAsset(formData: FormData) {
  const file = formData.get("file") as File;

  const asset: Omit<AssetEntity, "_id" | "uploadedAt" | "size"> = {
    filename: formData.get("filename")?.toString() || "",
    mimeType:
      formData.get("mimeType")?.toString() || "application/octet-stream",
    description: formData.get("description")?.toString(),
  };

  return await ServicesContainer.AssetsService().createAsset(asset, file);
}

export async function updateAsset(_id: string, update: AssetUpdate) {
  await ServicesContainer.AssetsService().updateAsset(_id, update);
  return okStatus;
}

export async function deleteAsset(_id: string) {
  const asset = await ServicesContainer.AssetsService().deleteAsset(_id);
  if (!asset) return notFound();

  return okStatus;
}

export async function deleteSelectedAssets(ids: string[]) {
  await ServicesContainer.AssetsService().deleteAssets(ids);

  return okStatus;
}

export async function checkUniqueFileName(filename: string, _id?: string) {
  return await ServicesContainer.AssetsService().checkUniqueFileName(
    filename,
    _id
  );
}
