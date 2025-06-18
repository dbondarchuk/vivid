"use server";

import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { okStatus, ServiceFieldUpdateModel } from "@vivid/types";
import { notFound } from "next/navigation";

const logger = getLoggerFactory("ServiceFieldsActions");

export async function create(field: ServiceFieldUpdateModel) {
  const actionLogger = logger("create");

  actionLogger.debug(
    {
      fieldName: field.name,
      fieldType: field.type,
      fieldLabel: field.data.label,
    },
    "Creating new service field"
  );

  try {
    const result = await ServicesContainer.ServicesService().createField(field);

    actionLogger.debug(
      {
        fieldId: result._id,
        fieldName: field.name,
        fieldType: field.type,
      },
      "Service field created successfully"
    );

    return result;
  } catch (error) {
    actionLogger.error(
      {
        fieldName: field.name,
        fieldType: field.type,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to create service field"
    );
    throw error;
  }
}

export async function update(_id: string, update: ServiceFieldUpdateModel) {
  const actionLogger = logger("update");

  actionLogger.debug(
    {
      fieldId: _id,
      fieldName: update.name,
      fieldType: update.type,
      fieldLabel: update.data.label,
    },
    "Updating service field"
  );

  try {
    await ServicesContainer.ServicesService().updateField(_id, update);

    actionLogger.debug(
      {
        fieldId: _id,
        fieldName: update.name,
        fieldType: update.type,
      },
      "Service field updated successfully"
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        fieldId: _id,
        fieldName: update.name,
        fieldType: update.type,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to update service field"
    );
    throw error;
  }
}

export async function deleteField(_id: string) {
  const actionLogger = logger("deleteField");

  actionLogger.debug(
    {
      fieldId: _id,
    },
    "Deleting service field"
  );

  try {
    const page = await ServicesContainer.ServicesService().deleteField(_id);
    if (!page) {
      actionLogger.warn(
        { fieldId: _id },
        "Service field not found for deletion"
      );
      return notFound();
    }

    actionLogger.debug(
      {
        fieldId: _id,
      },
      "Service field deleted successfully"
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        fieldId: _id,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to delete service field"
    );
    throw error;
  }
}

export async function deleteSelected(ids: string[]) {
  const actionLogger = logger("deleteSelected");

  actionLogger.debug(
    {
      fieldIds: ids,
      count: ids.length,
    },
    "Deleting selected service fields"
  );

  try {
    await ServicesContainer.ServicesService().deleteFields(ids);

    actionLogger.debug(
      {
        fieldIds: ids,
        count: ids.length,
      },
      "Selected service fields deleted successfully"
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        fieldIds: ids,
        count: ids.length,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to delete selected service fields"
    );
    throw error;
  }
}

export async function checkUniqueName(name: string, _id?: string) {
  const actionLogger = logger("checkUniqueName");

  actionLogger.debug(
    {
      fieldName: name,
      excludeId: _id,
    },
    "Checking field name uniqueness"
  );

  try {
    const result =
      await ServicesContainer.ServicesService().checkFieldUniqueName(name, _id);

    actionLogger.debug(
      {
        fieldName: name,
        excludeId: _id,
        isUnique: result,
      },
      "Field name uniqueness check completed"
    );

    return result;
  } catch (error) {
    actionLogger.error(
      {
        fieldName: name,
        excludeId: _id,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to check field name uniqueness"
    );
    throw error;
  }
}
