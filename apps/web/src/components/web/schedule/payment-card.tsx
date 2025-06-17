"use client";
import { DateTime } from "@vivid/types";

import React from "react";

import { useI18n } from "@/i18n/i18n";
import { PaymentAppForms } from "@vivid/app-store";
import { BaseCardProps } from "./base-card";
import { CardWithAppointmentInformation } from "./card-with-info";
import { useScheduleContext } from "./context";
import { formatAmountString } from "@vivid/utils";

export type PaymentCardProps = BaseCardProps & {
  dateTime: DateTime;
  duration: number;
  fields?: Record<string, any>;
};

export const PaymentCard: React.FC = () => {
  const i18n = useI18n();
  const {
    appointmentOption,
    selectedAddons,
    price,
    discount,
    paymentInformation: paymentForm,
    fields,
    onSubmit,
  } = useScheduleContext();
  if (!paymentForm) return null;

  const Form = PaymentAppForms[paymentForm.intent.appName];

  const isFullPayment = paymentForm.intent.percentage >= 100;

  return (
    <CardWithAppointmentInformation
      title={
        isFullPayment
          ? "payment_form_full_payment_required_title"
          : "payment_form_deposit_required_title"
      }
    >
      <div className="text-sm mb-3">
        {i18n(
          isFullPayment
            ? "payment_form_full_payment_required_description"
            : "payment_form_deposit_required_description",
          {
            percentage: paymentForm.intent.percentage,
            amount: formatAmountString(paymentForm.intent.amount),
          }
        )}
      </div>
      <Form
        optionId={appointmentOption._id}
        addonsIds={selectedAddons?.map((a) => a._id)}
        totalPrice={price}
        discount={discount}
        fields={fields}
        {...paymentForm.formProps}
        intent={paymentForm.intent}
        onSubmit={onSubmit}
      />
    </CardWithAppointmentInformation>
  );
};
