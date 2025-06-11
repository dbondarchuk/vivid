"use server";

import { ServicesContainer } from "@vivid/services";
import { DiscountUpdateModel, okStatus } from "@vivid/types";
import { notFound } from "next/navigation";

export async function create(discount: DiscountUpdateModel) {
  return await ServicesContainer.ServicesService().createDiscount(discount);
}

export async function update(_id: string, update: DiscountUpdateModel) {
  await ServicesContainer.ServicesService().updateDiscount(_id, update);
  return okStatus;
}

export async function deleteDiscount(_id: string) {
  const discount =
    await ServicesContainer.ServicesService().deleteDiscount(_id);
  if (!discount) return notFound();

  return okStatus;
}

export async function deleteSelected(ids: string[]) {
  await ServicesContainer.ServicesService().deleteDiscounts(ids);

  return okStatus;
}

export async function checkUniqueNameAndCode(
  name: string,
  codes: string[],
  _id?: string
) {
  return await ServicesContainer.ServicesService().checkDiscountUniqueNameAndCode(
    name,
    codes,
    _id
  );
}
