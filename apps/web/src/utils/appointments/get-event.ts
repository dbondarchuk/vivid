import { ServicesContainer } from "@vivid/services";
import {
  AppointmentDiscount,
  AppointmentEvent,
  AppointmentOption,
  AppointmentRequest,
  Customer,
} from "@vivid/types";
import { formatAmount, getDiscountAmount } from "@vivid/utils";

export const getAppointmentEventFromRequest = async (
  request: AppointmentRequest,
  ignoreFieldValidation?: boolean,
  files?: Record<string, any>
): Promise<
  | {
      event: AppointmentEvent;
      customer: Customer | null;
      option: AppointmentOption;
      addons: AppointmentEvent["addons"];
    }
  | {
      error: {
        code: string;
        message: string;
        status: number;
      };
    }
> => {
  const selectedOption = await ServicesContainer.ServicesService().getOption(
    request.optionId
  );

  if (!selectedOption) {
    return {
      error: {
        code: "unknown_option",
        message: `Can't find option with id '${request.optionId}'`,
        status: 400,
      },
    };
  }

  if (typeof selectedOption.duration === "undefined" && !request.duration) {
    return {
      error: {
        code: "duration_required",
        message: `Selected option requires the duration to be provided`,
        status: 400,
      },
    };
  }

  let selectedAddons: AppointmentEvent["addons"] = undefined;
  if (request.addonsIds) {
    selectedAddons = await ServicesContainer.ServicesService().getAddonsById(
      request.addonsIds
    );

    if (selectedAddons.length !== request.addonsIds.length) {
      return {
        error: {
          code: "unknown_addon",
          message: `Can't find one or more selected addons`,
          status: 400,
        },
      };
    }
  }

  const allFields: Map<string, boolean> = new Map();
  for (const field of [
    ...(selectedOption.fields || []),
    ...(selectedAddons?.flatMap((addon) => addon.fields ?? []) || []),
  ]) {
    if (!allFields.has(field.id)) {
      allFields.set(field.id, !!field.required);
    } else {
      allFields.set(field.id, !!field.required || !!allFields.get(field.id));
    }
  }

  const fieldsIds = Array.from(allFields.keys());
  const serviceFields =
    await ServicesContainer.ServicesService().getFieldsById(fieldsIds);

  if (!ignoreFieldValidation) {
    for (const field of serviceFields) {
      if (
        (field.required || allFields.get(field._id)) &&
        (!files?.[field.name] || !request.fields[field.name])
      ) {
        return {
          error: {
            code: "field_required",
            message: `Field ${field} is required`,
            status: 400,
          },
        };
      }
    }
  }

  const totalDuration =
    (selectedOption.duration ?? request.duration ?? 0) +
    (selectedAddons?.reduce((sum, cur) => sum + (cur.duration ?? 0), 0) ?? 0);

  let totalPrice: number | undefined =
    (selectedOption.price ?? 0) +
    (selectedAddons?.reduce((sum, cur) => sum + (cur.price ?? 0), 0) ?? 0);

  let appointmentDiscount: AppointmentDiscount | undefined = undefined;
  const customer = await ServicesContainer.CustomersService().findCustomer(
    request.fields.email,
    request.fields.phone
  );

  if (request.promoCode) {
    const discount = await ServicesContainer.ServicesService().applyDiscount({
      code: request.promoCode,
      dateTime: request.dateTime,
      optionId: request.optionId,
      addons: request.addonsIds,
      customerId: customer?._id,
    });

    if (!discount) {
      return {
        error: {
          code: "promo_code_not_valid",
          message: `Promo code is not valid`,
          status: 400,
        },
      };
    }

    const discountAmount = getDiscountAmount(totalPrice, discount);
    appointmentDiscount = {
      code: request.promoCode,
      discountAmount,
      id: discount._id,
      name: discount.name,
    };

    totalPrice = Math.max(0, formatAmount(totalPrice - discountAmount));
  }

  if (totalPrice === 0) totalPrice = undefined;

  return {
    event: {
      dateTime: request.dateTime,
      option: selectedOption,
      timeZone: request.timeZone,
      totalDuration,
      totalPrice,
      addons: selectedAddons,
      fields: request.fields,
      discount: appointmentDiscount,
      fieldsLabels: serviceFields.reduce(
        (map, field) => ({ ...map, [field.name]: field.data.label }),
        {} as Record<string, string>
      ),
    },
    customer,
    option: selectedOption,
    addons: selectedAddons,
  };
};
