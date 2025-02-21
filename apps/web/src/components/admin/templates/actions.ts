"use server";

import { ServicesContainer } from "@vivid/services";
import { okStatus, TemplateUpdateModel } from "@vivid/types";
import { notFound } from "next/navigation";

export async function createTemplate(template: TemplateUpdateModel) {
  return await ServicesContainer.TemplatesService().createTemplate(template);
}

export async function updateTemplate(id: string, update: TemplateUpdateModel) {
  await ServicesContainer.TemplatesService().updateTemplate(id, update);
  return okStatus;
}

export async function deleteTemplate(id: string) {
  const template =
    await ServicesContainer.TemplatesService().deleteTemplate(id);
  if (!template) return notFound();

  return okStatus;
}

export async function deleteSelectedTemplates(ids: string[]) {
  await ServicesContainer.TemplatesService().deleteTemplates(ids);

  return okStatus;
}

export async function checkUniqueName(name: string, id?: string) {
  return await ServicesContainer.TemplatesService().checkUniqueName(name, id);
}
