"use server";

import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { AppointmentAddonUpdateModel, okStatus } from "@vivid/types";
import { notFound } from "next/navigation";

const logger = getLoggerFactory("ServiceAddonsActions");

export async function create(field: AppointmentAddonUpdateModel) {
  const actionLogger = logger("create");

  actionLogger.debug(
    {
      addonName: field.name,
      addonPrice: field.price,
    },
    "Creating new service addon"
  );

  try {
    const result = await ServicesContainer.ServicesService().createAddon(field);

    actionLogger.debug(
      {
        addonId: result._id,
        addonName: field.name,
      },
      "Service addon created successfully"
    );

    return result;
  } catch (error) {
    actionLogger.error(
      {
        addonName: field.name,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to create service addon"
    );
    throw error;
  }
}

export async function update(_id: string, update: AppointmentAddonUpdateModel) {
  const actionLogger = logger("update");

  actionLogger.debug(
    {
      addonId: _id,
      addonName: update.name,
      addonPrice: update.price,
    },
    "Updating service addon"
  );

  try {
    await ServicesContainer.ServicesService().updateAddon(_id, update);

    actionLogger.debug(
      {
        addonId: _id,
        addonName: update.name,
      },
      "Service addon updated successfully"
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        addonId: _id,
        addonName: update.name,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to update service addon"
    );
    throw error;
  }
}

export async function deleteAddon(_id: string) {
  const actionLogger = logger("deleteAddon");

  actionLogger.debug(
    {
      addonId: _id,
    },
    "Deleting service addon"
  );

  try {
    const page = await ServicesContainer.ServicesService().deleteAddon(_id);
    if (!page) {
      actionLogger.warn(
        { addonId: _id },
        "Service addon not found for deletion"
      );
      return notFound();
    }

    actionLogger.debug(
      {
        addonId: _id,
      },
      "Service addon deleted successfully"
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        addonId: _id,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to delete service addon"
    );
    throw error;
  }
}

export async function deleteSelected(ids: string[]) {
  const actionLogger = logger("deleteSelected");

  actionLogger.debug(
    {
      addonIds: ids,
      count: ids.length,
    },
    "Deleting selected service addons"
  );

  try {
    await ServicesContainer.ServicesService().deleteAddons(ids);

    actionLogger.debug(
      {
        addonIds: ids,
        count: ids.length,
      },
      "Selected service addons deleted successfully"
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        addonIds: ids,
        count: ids.length,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to delete selected service addons"
    );
    throw error;
  }
}

export async function checkUniqueName(name: string, _id?: string) {
  const actionLogger = logger("checkUniqueName");

  actionLogger.debug(
    {
      addonName: name,
      excludeId: _id,
    },
    "Checking addon name uniqueness"
  );

  try {
    const result =
      await ServicesContainer.ServicesService().checkAddonUniqueName(name, _id);

    actionLogger.debug(
      {
        addonName: name,
        excludeId: _id,
        isUnique: result,
      },
      "Addon name uniqueness check completed"
    );

    return result;
  } catch (error) {
    actionLogger.error(
      {
        addonName: name,
        excludeId: _id,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to check addon name uniqueness"
    );
    throw error;
  }
}
