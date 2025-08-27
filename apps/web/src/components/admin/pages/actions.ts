"use server";

import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { okStatus, PageUpdateModel } from "@vivid/types";
import { notFound } from "next/navigation";

const logger = getLoggerFactory("PagesActions");

export async function createPage(page: PageUpdateModel) {
  const actionLogger = logger("createPage");

  actionLogger.debug(
    {
      pageTitle: page.title,
      pageSlug: page.slug,
      hasContent: !!page.content,
    },
    "Creating new page",
  );

  try {
    const result = await ServicesContainer.PagesService().createPage(page);

    actionLogger.debug(
      {
        pageId: result._id,
        pageTitle: page.title,
        pageSlug: page.slug,
      },
      "Page created successfully",
    );

    return result;
  } catch (error) {
    actionLogger.error(
      {
        pageTitle: page.title,
        pageSlug: page.slug,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to create page",
    );
    throw error;
  }
}

export async function updatePage(_id: string, update: PageUpdateModel) {
  const actionLogger = logger("updatePage");

  actionLogger.debug(
    {
      pageId: _id,
      pageTitle: update.title,
      pageSlug: update.slug,
      hasContent: !!update.content,
    },
    "Updating page",
  );

  try {
    await ServicesContainer.PagesService().updatePage(_id, update);

    actionLogger.debug(
      {
        pageId: _id,
        pageTitle: update.title,
        pageSlug: update.slug,
      },
      "Page updated successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        pageId: _id,
        pageTitle: update.title,
        pageSlug: update.slug,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to update page",
    );
    throw error;
  }
}

export async function deletePage(_id: string) {
  const actionLogger = logger("deletePage");

  actionLogger.debug(
    {
      pageId: _id,
    },
    "Deleting page",
  );

  try {
    const page = await ServicesContainer.PagesService().deletePage(_id);
    if (!page) {
      actionLogger.warn({ pageId: _id }, "Page not found for deletion");
      return notFound();
    }

    actionLogger.debug(
      {
        pageId: _id,
        pageTitle: page.title,
        pageSlug: page.slug,
      },
      "Page deleted successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        pageId: _id,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to delete page",
    );
    throw error;
  }
}

export async function deleteSelectedPages(ids: string[]) {
  const actionLogger = logger("deleteSelectedPages");

  actionLogger.debug(
    {
      pageIds: ids,
      count: ids.length,
    },
    "Deleting selected pages",
  );

  try {
    await ServicesContainer.PagesService().deletePages(ids);

    actionLogger.debug(
      {
        pageIds: ids,
        count: ids.length,
      },
      "Selected pages deleted successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        pageIds: ids,
        count: ids.length,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to delete selected pages",
    );
    throw error;
  }
}

export async function checkUniqueSlug(slug: string, _id?: string) {
  const actionLogger = logger("checkUniqueSlug");

  actionLogger.debug(
    {
      pageSlug: slug,
      excludeId: _id,
    },
    "Checking page slug uniqueness",
  );

  try {
    const result = await ServicesContainer.PagesService().checkUniqueSlug(
      slug,
      _id,
    );

    actionLogger.debug(
      {
        pageSlug: slug,
        excludeId: _id,
        isUnique: result,
      },
      "Page slug uniqueness check completed",
    );

    return result;
  } catch (error) {
    actionLogger.error(
      {
        pageSlug: slug,
        excludeId: _id,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to check page slug uniqueness",
    );
    throw error;
  }
}
