"use server";

import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { okStatus, TemplateUpdateModel } from "@vivid/types";
import { notFound } from "next/navigation";

const logger = getLoggerFactory("TemplatesActions");

export async function createTemplate(template: TemplateUpdateModel) {
  const actionLogger = logger("createTemplate");

  actionLogger.debug(
    {
      templateName: template.name,
      templateType: template.type,
      hasValue: !!template.value,
    },
    "Creating new template",
  );

  try {
    const result =
      await ServicesContainer.TemplatesService().createTemplate(template);

    actionLogger.debug(
      {
        templateId: result._id,
        templateName: template.name,
        templateType: template.type,
      },
      "Template created successfully",
    );

    return result;
  } catch (error) {
    actionLogger.error(
      {
        templateName: template.name,
        templateType: template.type,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to create template",
    );
    throw error;
  }
}

export async function updateTemplate(id: string, update: TemplateUpdateModel) {
  const actionLogger = logger("updateTemplate");

  actionLogger.debug(
    {
      templateId: id,
      templateName: update.name,
      templateType: update.type,
      hasValue: !!update.value,
    },
    "Updating template",
  );

  try {
    await ServicesContainer.TemplatesService().updateTemplate(id, update);

    actionLogger.debug(
      {
        templateId: id,
        templateName: update.name,
        templateType: update.type,
      },
      "Template updated successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        templateId: id,
        templateName: update.name,
        templateType: update.type,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to update template",
    );
    throw error;
  }
}

export async function deleteTemplate(id: string) {
  const actionLogger = logger("deleteTemplate");

  actionLogger.debug(
    {
      templateId: id,
    },
    "Deleting template",
  );

  try {
    const template =
      await ServicesContainer.TemplatesService().deleteTemplate(id);
    if (!template) {
      actionLogger.warn({ templateId: id }, "Template not found for deletion");
      return notFound();
    }

    actionLogger.debug(
      {
        templateId: id,
        templateName: template.name,
        templateType: template.type,
      },
      "Template deleted successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        templateId: id,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to delete template",
    );
    throw error;
  }
}

export async function deleteSelectedTemplates(ids: string[]) {
  const actionLogger = logger("deleteSelectedTemplates");

  actionLogger.debug(
    {
      templateIds: ids,
      count: ids.length,
    },
    "Deleting selected templates",
  );

  try {
    await ServicesContainer.TemplatesService().deleteTemplates(ids);

    actionLogger.debug(
      {
        templateIds: ids,
        count: ids.length,
      },
      "Selected templates deleted successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        templateIds: ids,
        count: ids.length,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to delete selected templates",
    );
    throw error;
  }
}

export async function checkUniqueName(name: string, id?: string) {
  const actionLogger = logger("checkUniqueName");

  actionLogger.debug(
    {
      templateName: name,
      excludeId: id,
    },
    "Checking template name uniqueness",
  );

  try {
    const result = await ServicesContainer.TemplatesService().checkUniqueName(
      name,
      id,
    );

    actionLogger.debug(
      {
        templateName: name,
        excludeId: id,
        isUnique: result,
      },
      "Template name uniqueness check completed",
    );

    return result;
  } catch (error) {
    actionLogger.error(
      {
        templateName: name,
        excludeId: id,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to check template name uniqueness",
    );
    throw error;
  }
}
