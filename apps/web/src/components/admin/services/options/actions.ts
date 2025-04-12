"use server";

import { ServicesContainer } from "@vivid/services";
import { AppointmentOptionUpdateModel, okStatus } from "@vivid/types";
import { notFound } from "next/navigation";

export async function create(field: AppointmentOptionUpdateModel) {
  return await ServicesContainer.ServicesService().createOption(field);
}

export async function update(
  _id: string,
  update: AppointmentOptionUpdateModel
) {
  await ServicesContainer.ServicesService().updateOption(_id, update);
  return okStatus;
}

export async function deleteOption(_id: string) {
  const page = await ServicesContainer.ServicesService().deleteOption(_id);
  if (!page) return notFound();

  return okStatus;
}

export async function deleteSelected(ids: string[]) {
  await ServicesContainer.ServicesService().deleteOptions(ids);

  return okStatus;
}

export async function checkUniqueName(name: string, _id?: string) {
  return await ServicesContainer.ServicesService().checkOptionUniqueName(
    name,
    _id
  );
}
