"use server";

import { Services } from "@/lib/services";
import { PageCreate, PageUpdate } from "@/types";
import { okStatus } from "@/types/general/actionStatus";
import { notFound } from "next/navigation";

export async function createPage(page: PageCreate) {
  return await Services.PagesService().createPage(page);
}

export async function updatePage(_id: string, update: PageUpdate) {
  await Services.PagesService().updatePage(_id, update);
  return okStatus;
}

export async function deletePage(_id: string) {
  const page = await Services.PagesService().deletePage(_id);
  if (!page) return notFound();

  return okStatus;
}

export async function deleteSelectedPages(ids: string[]) {
  await Services.PagesService().deletePages(ids);

  return okStatus;
}

export async function checkUniqueSlug(slug: string, _id?: string) {
  return await Services.PagesService().checkUniqueSlug(slug, _id);
}
