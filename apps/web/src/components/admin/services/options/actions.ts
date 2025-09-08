"use server";

import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { AppointmentOptionUpdateModel, okStatus } from "@vivid/types";
import { notFound } from "next/navigation";

const logger = getLoggerFactory("ServiceOptionsActions");

export async function create(field: AppointmentOptionUpdateModel) {
  const actionLogger = logger("create");

  actionLogger.debug(
    {
      optionName: field.name,
      optionDuration: field.duration,
      optionPrice: field.price,
    },
    "Creating new service option",
  );

  try {
    const result =
      await ServicesContainer.ServicesService().createOption(field);

    actionLogger.debug(
      {
        optionId: result._id,
        optionName: field.name,
      },
      "Service option created successfully",
    );

    return result;
  } catch (error) {
    actionLogger.error(
      {
        optionName: field.name,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to create service option",
    );
    throw error;
  }
}

export async function update(
  _id: string,
  update: AppointmentOptionUpdateModel,
) {
  const actionLogger = logger("update");

  actionLogger.debug(
    {
      optionId: _id,
      optionName: update.name,
      optionDuration: update.duration,
      optionPrice: update.price,
    },
    "Updating service option",
  );

  try {
    await ServicesContainer.ServicesService().updateOption(_id, update);

    actionLogger.debug(
      {
        optionId: _id,
        optionName: update.name,
      },
      "Service option updated successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        optionId: _id,
        optionName: update.name,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to update service option",
    );
    throw error;
  }
}

export async function deleteOption(_id: string) {
  const actionLogger = logger("deleteOption");

  actionLogger.debug(
    {
      optionId: _id,
    },
    "Deleting service option",
  );

  try {
    const page = await ServicesContainer.ServicesService().deleteOption(_id);
    if (!page) {
      actionLogger.warn(
        { optionId: _id },
        "Service option not found for deletion",
      );
      return notFound();
    }

    actionLogger.debug(
      {
        optionId: _id,
      },
      "Service option deleted successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        optionId: _id,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to delete service option",
    );
    throw error;
  }
}

export async function deleteSelected(ids: string[]) {
  const actionLogger = logger("deleteSelected");

  actionLogger.debug(
    {
      optionIds: ids,
      count: ids.length,
    },
    "Deleting selected service options",
  );

  try {
    await ServicesContainer.ServicesService().deleteOptions(ids);

    actionLogger.debug(
      {
        optionIds: ids,
        count: ids.length,
      },
      "Selected service options deleted successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        optionIds: ids,
        count: ids.length,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to delete selected service options",
    );
    throw error;
  }
}

export async function checkUniqueName(name: string, _id?: string) {
  const actionLogger = logger("checkUniqueName");

  actionLogger.debug(
    {
      optionName: name,
      excludeId: _id,
    },
    "Checking option name uniqueness",
  );

  try {
    const result =
      await ServicesContainer.ServicesService().checkOptionUniqueName(
        name,
        _id,
      );

    actionLogger.debug(
      {
        optionName: name,
        excludeId: _id,
        isUnique: result,
      },
      "Option name uniqueness check completed",
    );

    return result;
  } catch (error) {
    actionLogger.error(
      {
        optionName: name,
        excludeId: _id,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to check option name uniqueness",
    );
    throw error;
  }
}
