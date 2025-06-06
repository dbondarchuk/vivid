"use server";

import { ServicesContainer } from "@vivid/services";
import { CustomerUpdateModel, okStatus } from "@vivid/types";
import { notFound } from "next/navigation";

export async function create(customer: CustomerUpdateModel) {
  return await ServicesContainer.CustomersService().createCustomer(customer);
}

export async function update(_id: string, update: CustomerUpdateModel) {
  await ServicesContainer.CustomersService().updateCustomer(_id, update);
  return okStatus;
}

export async function deleteCustomer(_id: string) {
  const customer =
    await ServicesContainer.CustomersService().deleteCustomer(_id);
  if (!customer) return notFound();

  return okStatus;
}

export async function deleteSelected(ids: string[]) {
  await ServicesContainer.CustomersService().deleteCustomers(ids);

  return okStatus;
}

export async function mergeSelected(targetId: string, ids: string[]) {
  await ServicesContainer.CustomersService().mergeCustomers(targetId, ids);

  return okStatus;
}

export async function checkUniqueEmailAndPhone(
  emails: string[],
  phones: string[],
  _id?: string
) {
  return await ServicesContainer.CustomersService().checkUniqueEmailAndPhone(
    emails,
    phones,
    _id
  );
}
