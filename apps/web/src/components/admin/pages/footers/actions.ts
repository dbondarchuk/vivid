"use server";

import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { okStatus, PageFooterUpdateModel } from "@vivid/types";
import { notFound } from "next/navigation";

const logger = getLoggerFactory("PageFootersActions");

export async function createPageFooter(pageFooter: PageFooterUpdateModel) {
  const actionLogger = logger("createPageFooter");

  actionLogger.debug(
    {
      pageFooterName: pageFooter.name,
    },
    "Creating new page footer"
  );

  try {
    const result =
      await ServicesContainer.PagesService().createPageFooter(pageFooter);

    actionLogger.debug(
      {
        pageId: result._id,
        pageFooterName: pageFooter.name,
      },
      "Page footer created successfully"
    );

    return result;
  } catch (error) {
    actionLogger.error(
      {
        pageFooterName: pageFooter.name,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to create page footer"
    );
    throw error;
  }
}

export async function updatePageFooter(
  _id: string,
  update: PageFooterUpdateModel
) {
  const actionLogger = logger("updatePageFooter");

  actionLogger.debug(
    {
      pageId: _id,
      pageFooterName: update.name,
    },
    "Updating page footer"
  );

  try {
    await ServicesContainer.PagesService().updatePageFooter(_id, update);

    actionLogger.debug(
      {
        pageId: _id,
        pageFooterName: update.name,
      },
      "Page footer updated successfully"
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        pageId: _id,
        pageFooterName: update.name,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to update page footer"
    );
    throw error;
  }
}

export async function deletePageFooter(_id: string) {
  const actionLogger = logger("deletePageFooter");

  actionLogger.debug(
    {
      pageId: _id,
    },
    "Deleting page footer"
  );

  try {
    const pageFooter =
      await ServicesContainer.PagesService().deletePageFooter(_id);

    if (!pageFooter) {
      actionLogger.warn({ pageId: _id }, "Page footer not found for deletion");
      return notFound();
    }

    actionLogger.debug(
      {
        pageId: _id,
        pageFooterName: pageFooter.name,
      },
      "Page footer deleted successfully"
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        pageId: _id,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to delete page footer"
    );
    throw error;
  }
}

export async function deleteSelectedPageFooters(ids: string[]) {
  const actionLogger = logger("deleteSelectedPageFooters");

  actionLogger.debug(
    {
      pageIds: ids,
      count: ids.length,
    },
    "Deleting selected page footers"
  );

  try {
    await ServicesContainer.PagesService().deletePageFooters(ids);

    actionLogger.debug(
      {
        pageIds: ids,
        count: ids.length,
      },
      "Selected page footers deleted successfully"
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        pageIds: ids,
        count: ids.length,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to delete selected page footers"
    );
    throw error;
  }
}

export async function checkUniquePageFooterName(name: string, _id?: string) {
  const actionLogger = logger("checkUniquePageFooterName");

  actionLogger.debug(
    {
      pageFooterName: name,
      excludeId: _id,
    },
    "Checking page footer name uniqueness"
  );

  try {
    const result =
      await ServicesContainer.PagesService().checkUniquePageFooterName(
        name,
        _id
      );

    actionLogger.debug(
      {
        pageFooterName: name,
        excludeId: _id,
        isUnique: result,
      },
      "Page footer name uniqueness check completed"
    );

    return result;
  } catch (error) {
    actionLogger.error(
      {
        pageFooterName: name,
        excludeId: _id,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to check page footer name uniqueness"
    );
    throw error;
  }
}
