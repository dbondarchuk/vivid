"use server";

import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { CustomerUpdateModel, okStatus } from "@vivid/types";
import { notFound } from "next/navigation";

const logger = getLoggerFactory("CustomersActions");

export async function create(customer: CustomerUpdateModel) {
  const actionLogger = logger("create");

  actionLogger.debug(
    {
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      knownEmailsCount: customer.knownEmails?.length || 0,
      knownPhonesCount: customer.knownPhones?.length || 0,
    },
    "Creating new customer",
  );

  try {
    const result =
      await ServicesContainer.CustomersService().createCustomer(customer);

    actionLogger.debug(
      {
        customerId: result,
        customerName: customer.name,
        customerEmail: customer.email,
      },
      "Customer created successfully",
    );

    return result;
  } catch (error) {
    actionLogger.error(
      {
        customerName: customer.name,
        customerEmail: customer.email,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to create customer",
    );
    throw error;
  }
}

export async function update(_id: string, update: CustomerUpdateModel) {
  const actionLogger = logger("update");

  actionLogger.debug(
    {
      customerId: _id,
      customerName: update.name,
      customerEmail: update.email,
      customerPhone: update.phone,
      knownEmailsCount: update.knownEmails?.length || 0,
      knownPhonesCount: update.knownPhones?.length || 0,
    },
    "Updating customer",
  );

  try {
    await ServicesContainer.CustomersService().updateCustomer(_id, update);

    actionLogger.debug(
      {
        customerId: _id,
        customerName: update.name,
        customerEmail: update.email,
      },
      "Customer updated successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        customerId: _id,
        customerName: update.name,
        customerEmail: update.email,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to update customer",
    );
    throw error;
  }
}

export async function deleteCustomer(_id: string) {
  const actionLogger = logger("deleteCustomer");

  actionLogger.debug(
    {
      customerId: _id,
    },
    "Deleting customer",
  );

  try {
    const customer =
      await ServicesContainer.CustomersService().deleteCustomer(_id);
    if (!customer) {
      actionLogger.warn({ customerId: _id }, "Customer not found for deletion");
      return notFound();
    }

    actionLogger.debug(
      {
        customerId: _id,
        customerName: customer.name,
        customerEmail: customer.email,
      },
      "Customer deleted successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        customerId: _id,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to delete customer",
    );
    throw error;
  }
}

export async function deleteSelected(ids: string[]) {
  const actionLogger = logger("deleteSelected");

  actionLogger.debug(
    {
      customerIds: ids,
      count: ids.length,
    },
    "Deleting selected customers",
  );

  try {
    await ServicesContainer.CustomersService().deleteCustomers(ids);

    actionLogger.debug(
      {
        customerIds: ids,
        count: ids.length,
      },
      "Selected customers deleted successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        customerIds: ids,
        count: ids.length,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to delete selected customers",
    );
    throw error;
  }
}

export async function mergeSelected(targetId: string, ids: string[]) {
  const actionLogger = logger("mergeSelected");

  actionLogger.debug(
    {
      targetCustomerId: targetId,
      customerIdsToMerge: ids,
      count: ids.length,
    },
    "Merging selected customers",
  );

  try {
    await ServicesContainer.CustomersService().mergeCustomers(targetId, ids);

    actionLogger.debug(
      {
        targetCustomerId: targetId,
        customerIdsToMerge: ids,
        count: ids.length,
      },
      "Selected customers merged successfully",
    );

    return okStatus;
  } catch (error) {
    actionLogger.error(
      {
        targetCustomerId: targetId,
        customerIdsToMerge: ids,
        count: ids.length,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to merge selected customers",
    );
    throw error;
  }
}

export async function checkUniqueEmailAndPhone(
  emails: string[],
  phones: string[],
  _id?: string,
) {
  const actionLogger = logger("checkUniqueEmailAndPhone");

  actionLogger.debug(
    {
      customerEmails: emails,
      customerPhones: phones,
      excludeId: _id,
    },
    "Checking customer email and phone uniqueness",
  );

  try {
    const result =
      await ServicesContainer.CustomersService().checkUniqueEmailAndPhone(
        emails,
        phones,
        _id,
      );

    actionLogger.debug(
      {
        customerEmails: emails,
        customerPhones: phones,
        excludeId: _id,
        isUnique: result,
      },
      "Customer email and phone uniqueness check completed",
    );

    return result;
  } catch (error) {
    actionLogger.error(
      {
        customerEmails: emails,
        customerPhones: phones,
        excludeId: _id,
        error: error instanceof Error ? error.message : String(error),
      },
      "Failed to check customer email and phone uniqueness",
    );
    throw error;
  }
}
