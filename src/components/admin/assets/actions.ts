"use server";

import { Services } from "@/lib/services";
import { Asset, AssetUpdate } from "@/types";
import { okStatus } from "@/types/general/actionStatus";
import { existsSync } from "fs";
import fs from "fs/promises";
import { notFound } from "next/navigation";
import path from "path";

export async function createAsset(formData: FormData) {
  const file = formData.get("file") as File;

  const asset: Omit<Asset, "_id" | "uploadedAt"> = {
    filename: formData.get("filename")?.toString() || "",
    description: formData.get("description")?.toString(),
  };

  await saveFile(file, asset.filename);
  return await Services.AssetsService().createAsset(asset);
}

export async function updateAsset(_id: string, update: AssetUpdate) {
  await Services.AssetsService().updateAsset(_id, update);
  return okStatus;
}

export async function deleteAsset(_id: string) {
  const asset = await Services.AssetsService().deleteAsset(_id);
  if (!asset) return notFound();

  await deleteFile(asset.filename);
  return okStatus;
}

export async function checkUniqueFileName(filename: string, _id?: string) {
  return await Services.AssetsService().checkUniqueFileName(filename, _id);
}

async function saveFile(file: File, filename: string) {
  const filepath = path.join(process.cwd(), "public", "upload", filename);

  const data = await file.arrayBuffer();
  await fs.appendFile(filepath, Buffer.from(data));
}

async function deleteFile(filename: string) {
  const filepath = path.join(process.cwd(), "public", "upload", filename);
  if (!existsSync(filename)) return;

  await fs.rm(filepath);
}