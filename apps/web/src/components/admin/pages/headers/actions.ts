"use server";

import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { okStatus, PageHeaderUpdateModel } from "@vivid/types";
import { notFound } from "next/navigation";

const logger = getLoggerFactory("PageHeadersActions");

export async function createPageHeader(pageHeader: PageHeaderUpdateModel) {
  const actionLogger = logger("createPageHeader");

  actionLogger.debug(
    {
      pageHeaderName: pageHeader.name,
    },
    "Creating new page",
  );

  try {
    const result =
      await ServicesContainer.PagesService().createPageHeader(pageHeader);

    actionLogger.debug(
      {
        pageId: result._id,
        pageHeaderName: pageHeader.name,
      },
      "Page header created successfully",
    );

    return result;
  } catch (error) {
    actionLogger.error(
      {
        pageHeaderName: pageHeader.name,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to create page header",
    );
    throw error;
  }
}

export async function updatePageHeader(
  _id: string,
  update: PageHeaderUpdateModel,
) {
  const actionLogger = logger("updatePageHeader");

  actionLogger.debug(
    {
      pageId: _id,
      pageHeaderName: update.name,
    },
    "Updating page",
  );

  try {
    await ServicesContainer.PagesService().updatePageHeader(_id, update);

    actionLogger.debug(
      {
        pageId: _id,
        pageHeaderName: update.name,
      },
      "Page header updated successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        pageId: _id,
        pageHeaderName: update.name,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to update page header",
    );
    throw error;
  }
}

export async function deletePageHeader(_id: string) {
  const actionLogger = logger("deletePageHeader");

  actionLogger.debug(
    {
      pageId: _id,
    },
    "Deleting page header",
  );

  try {
    const pageHeader =
      await ServicesContainer.PagesService().deletePageHeader(_id);

    if (!pageHeader) {
      actionLogger.warn({ pageId: _id }, "Page header not found for deletion");
      return notFound();
    }

    actionLogger.debug(
      {
        pageId: _id,
        pageHeaderName: pageHeader.name,
      },
      "Page header deleted successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        pageId: _id,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to delete page header",
    );
    throw error;
  }
}

export async function deleteSelectedPageHeaders(ids: string[]) {
  const actionLogger = logger("deleteSelectedPageHeaders");

  actionLogger.debug(
    {
      pageIds: ids,
      count: ids.length,
    },
    "Deleting selected page headers",
  );

  try {
    await ServicesContainer.PagesService().deletePageHeaders(ids);

    actionLogger.debug(
      {
        pageIds: ids,
        count: ids.length,
      },
      "Selected page headers deleted successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        pageIds: ids,
        count: ids.length,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to delete selected page headers",
    );
    throw error;
  }
}

export async function checkUniquePageHeaderName(name: string, _id?: string) {
  const actionLogger = logger("checkUniquePageHeaderName");

  actionLogger.debug(
    {
      pageHeaderName: name,
      excludeId: _id,
    },
    "Checking page header name uniqueness",
  );

  try {
    const result =
      await ServicesContainer.PagesService().checkUniquePageHeaderName(
        name,
        _id,
      );

    actionLogger.debug(
      {
        pageHeaderName: name,
        excludeId: _id,
        isUnique: result,
      },
      "Page header name uniqueness check completed",
    );

    return result;
  } catch (error) {
    actionLogger.error(
      {
        pageHeaderName: name,
        excludeId: _id,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to check page header name uniqueness",
    );
    throw error;
  }
}
