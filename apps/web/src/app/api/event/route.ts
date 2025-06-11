import { ServicesContainer } from "@vivid/services";
import {
  AppointmentDiscount,
  AppointmentEvent,
  appointmentRequestSchema,
  AppointmentTimeNotAvaialbleError,
} from "@vivid/types";
import { formatAmount, getDiscountAmount } from "@vivid/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const json = formData.get("json") as string;
  if (!json) {
    return NextResponse.json(
      {
        success: false,
        error: "json_missing",
        message: "JSON with event data is missing",
      },
      { status: 400 }
    );
  }

  const appointmentRequestParsed = JSON.parse(json);
  const {
    data: appointmentRequest,
    success: parseSuccess,
    error: parseError,
  } = appointmentRequestSchema.safeParse(appointmentRequestParsed);

  if (!parseSuccess) {
    return NextResponse.json(parseError, { status: 400 });
  }

  let files: Record<string, File> | undefined = undefined;
  const fileFields = formData.getAll("fileField") as string[];
  if (!!fileFields) {
    try {
      files = fileFields.reduce(
        (map, fileField) => {
          const file = formData.get(`file_${fileField}`) as File;
          if (!file) {
            throw new Error("File field is not present");
          }

          return {
            ...map,
            [fileField]: file,
          };
        },
        {} as Record<string, File>
      );
    } catch (e: any) {
      return NextResponse.json(
        { success: false, error: "file_not_uploaded", message: e?.message },
        { status: 400 }
      );
    }
  }

  const selectedOption = await ServicesContainer.ServicesService().getOption(
    appointmentRequest.optionId
  );

  if (!selectedOption) {
    return NextResponse.json(
      {
        success: false,
        error: "unknown_option",
        message: `Can't find option with id '${appointmentRequest.optionId}'`,
      },
      { status: 400 }
    );
  }

  if (
    typeof selectedOption.duration === "undefined" &&
    !appointmentRequest.duration
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "duration_required",
        message: `Selected option requires the duration to be provided`,
      },
      { status: 400 }
    );
  }

  let selectedAddons: AppointmentEvent["addons"] = undefined;
  if (appointmentRequest.addonsIds) {
    selectedAddons = await ServicesContainer.ServicesService().getAddonsById(
      appointmentRequest.addonsIds
    );

    if (selectedAddons.length !== appointmentRequest.addonsIds.length) {
      return NextResponse.json(
        {
          success: false,
          error: "unknown_addon",
          message: `Can't find one or more selected addons`,
        },
        { status: 400 }
      );
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

  for (const field of serviceFields) {
    if (
      (field.required || allFields.get(field._id)) &&
      !(!!appointmentRequest.fields[field.name] || !!files?.[field.name])
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "field_required",
          message: `Field ${field} is required`,
        },
        { status: 400 }
      );
    }
  }

  const totalDuration =
    (selectedOption.duration ?? appointmentRequest.duration ?? 0) +
    (selectedAddons?.reduce((sum, cur) => sum + (cur.duration ?? 0), 0) ?? 0);

  let totalPrice: number | undefined =
    (selectedOption.price ?? 0) +
    (selectedAddons?.reduce((sum, cur) => sum + (cur.price ?? 0), 0) ?? 0);

  let appointmentDiscount: AppointmentDiscount | undefined = undefined;
  if (appointmentRequest.promoCode) {
    const customer = await ServicesContainer.CustomersService().findCustomer(
      appointmentRequest.fields.email,
      appointmentRequest.fields.phone
    );
    const discount = await ServicesContainer.ServicesService().applyDiscount({
      code: appointmentRequest.promoCode,
      dateTime: appointmentRequest.dateTime,
      optionId: appointmentRequest.optionId,
      addons: appointmentRequest.addonsIds,
      customerId: customer?._id,
    });

    if (!discount) {
      return NextResponse.json(
        {
          success: false,
          error: "promo_code_not_valid",
          message: `Promo code is not valid`,
        },
        { status: 400 }
      );
    }

    const discountAmount = getDiscountAmount(totalPrice, discount);
    appointmentDiscount = {
      code: appointmentRequest.promoCode,
      discountAmount,
      id: discount._id,
      name: discount.name,
    };

    totalPrice = Math.max(0, formatAmount(totalPrice - discountAmount));
  }

  if (totalPrice === 0) totalPrice = undefined;

  try {
    const { _id } = await ServicesContainer.EventsService().createEvent({
      event: {
        dateTime: appointmentRequest.dateTime,
        option: selectedOption,
        timeZone: appointmentRequest.timeZone,
        totalDuration,
        totalPrice,
        addons: selectedAddons,
        fields: appointmentRequest.fields,
        discount: appointmentDiscount,
        fieldsLabels: serviceFields.reduce(
          (map, field) => ({ ...map, [field.name]: field.data.label }),
          {} as Record<string, string>
        ),
      },
      files,
    });

    return NextResponse.json({ success: true, id: _id }, { status: 201 });
  } catch (e: any) {
    if (e instanceof AppointmentTimeNotAvaialbleError) {
      return NextResponse.json(
        { success: false, error: "time_not_available", message: e?.message },
        { status: 400 }
      );
    } else {
      throw e;
    }
  }
}
