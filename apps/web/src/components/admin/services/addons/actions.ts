"use server";

import { ServicesContainer } from "@vivid/services";
import { AppointmentAddonUpdateModel, okStatus } from "@vivid/types";
import { notFound } from "next/navigation";

export async function create(field: AppointmentAddonUpdateModel) {
  return await ServicesContainer.ServicesService().createAddon(field);
}

export async function update(_id: string, update: AppointmentAddonUpdateModel) {
  await ServicesContainer.ServicesService().updateAddon(_id, update);
  return okStatus;
}

export async function deleteAddon(_id: string) {
  const page = await ServicesContainer.ServicesService().deleteAddon(_id);
  if (!page) return notFound();

  return okStatus;
}

export async function deleteSelected(ids: string[]) {
  await ServicesContainer.ServicesService().deleteAddons(ids);

  return okStatus;
}

export async function checkUniqueName(name: string, _id?: string) {
  return await ServicesContainer.ServicesService().checkAddonUniqueName(
    name,
    _id
  );
}
