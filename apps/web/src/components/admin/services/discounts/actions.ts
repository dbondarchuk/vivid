"use server";

import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { DiscountUpdateModel, okStatus } from "@vivid/types";
import { notFound } from "next/navigation";

const logger = getLoggerFactory("ServiceDiscountsActions");

export async function create(discount: DiscountUpdateModel) {
  const actionLogger = logger("create");

  actionLogger.debug(
    {
      discountName: discount.name,
      discountType: discount.type,
      discountValue: discount.value,
      discountCodes: discount.codes,
    },
    "Creating new service discount"
  );

  try {
    const result =
      await ServicesContainer.ServicesService().createDiscount(discount);

    actionLogger.debug(
      {
        discountId: result._id,
        discountName: discount.name,
        discountType: discount.type,
      },
      "Service discount created successfully"
    );

    return result;
  } catch (error) {
    actionLogger.error(
      {
        discountName: discount.name,
        discountType: discount.type,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to create service discount"
    );
    throw error;
  }
}

export async function update(_id: string, update: DiscountUpdateModel) {
  const actionLogger = logger("update");

  actionLogger.debug(
    {
      discountId: _id,
      discountName: update.name,
      discountType: update.type,
      discountValue: update.value,
      discountCodes: update.codes,
    },
    "Updating service discount"
  );

  try {
    await ServicesContainer.ServicesService().updateDiscount(_id, update);

    actionLogger.debug(
      {
        discountId: _id,
        discountName: update.name,
        discountType: update.type,
      },
      "Service discount updated successfully"
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        discountId: _id,
        discountName: update.name,
        discountType: update.type,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to update service discount"
    );
    throw error;
  }
}

export async function deleteDiscount(_id: string) {
  const actionLogger = logger("deleteDiscount");

  actionLogger.debug(
    {
      discountId: _id,
    },
    "Deleting service discount"
  );

  try {
    const discount =
      await ServicesContainer.ServicesService().deleteDiscount(_id);
    if (!discount) {
      actionLogger.warn(
        { discountId: _id },
        "Service discount not found for deletion"
      );
      return notFound();
    }

    actionLogger.debug(
      {
        discountId: _id,
      },
      "Service discount deleted successfully"
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        discountId: _id,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to delete service discount"
    );
    throw error;
  }
}

export async function deleteSelected(ids: string[]) {
  const actionLogger = logger("deleteSelected");

  actionLogger.debug(
    {
      discountIds: ids,
      count: ids.length,
    },
    "Deleting selected service discounts"
  );

  try {
    await ServicesContainer.ServicesService().deleteDiscounts(ids);

    actionLogger.debug(
      {
        discountIds: ids,
        count: ids.length,
      },
      "Selected service discounts deleted successfully"
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        discountIds: ids,
        count: ids.length,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to delete selected service discounts"
    );
    throw error;
  }
}

export async function checkUniqueNameAndCode(
  name: string,
  codes: string[],
  _id?: string
) {
  const actionLogger = logger("checkUniqueNameAndCode");

  actionLogger.debug(
    {
      discountName: name,
      discountCodes: codes,
      excludeId: _id,
    },
    "Checking discount name and code uniqueness"
  );

  try {
    const result =
      await ServicesContainer.ServicesService().checkDiscountUniqueNameAndCode(
        name,
        codes,
        _id
      );

    actionLogger.debug(
      {
        discountName: name,
        discountCodes: codes,
        excludeId: _id,
        isUnique: result,
      },
      "Discount name and code uniqueness check completed"
    );

    return result;
  } catch (error) {
    actionLogger.error(
      {
        discountName: name,
        discountCodes: codes,
        excludeId: _id,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to check discount name and code uniqueness"
    );
    throw error;
  }
}
