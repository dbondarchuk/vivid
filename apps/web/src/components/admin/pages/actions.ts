"use server";

import { ServicesContainer } from "@vivid/services";
import { okStatus, PageCreate, PageUpdate } from "@vivid/types";
import { notFound } from "next/navigation";

export async function createPage(page: PageCreate) {
  return await ServicesContainer.PagesService().createPage(page);
}

export async function updatePage(_id: string, update: PageUpdate) {
  await ServicesContainer.PagesService().updatePage(_id, update);
  return okStatus;
}

export async function deletePage(_id: string) {
  const page = await ServicesContainer.PagesService().deletePage(_id);
  if (!page) return notFound();

  return okStatus;
}

export async function deleteSelectedPages(ids: string[]) {
  await ServicesContainer.PagesService().deletePages(ids);

  return okStatus;
}

export async function checkUniqueSlug(slug: string, _id?: string) {
  return await ServicesContainer.PagesService().checkUniqueSlug(slug, _id);
}
