"use server";

import { ServicesContainer } from "@vivid/services";
import { okStatus, ServiceFieldUpdateModel } from "@vivid/types";
import { notFound } from "next/navigation";

export async function create(field: ServiceFieldUpdateModel) {
  return await ServicesContainer.ServicesService().createField(field);
}

export async function update(_id: string, update: ServiceFieldUpdateModel) {
  await ServicesContainer.ServicesService().updateField(_id, update);
  return okStatus;
}

export async function deleteField(_id: string) {
  const page = await ServicesContainer.ServicesService().deleteField(_id);
  if (!page) return notFound();

  return okStatus;
}

export async function deleteSelected(ids: string[]) {
  await ServicesContainer.ServicesService().deleteFields(ids);

  return okStatus;
}

export async function checkUniqueName(name: string, _id?: string) {
  return await ServicesContainer.ServicesService().checkFieldUniqueName(
    name,
    _id
  );
}
