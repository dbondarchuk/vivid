import type { ReactNode } from "react";
import { PAYPAL_APP_NAME } from "./apps/paypal/const";
import { PaypalForm } from "./apps/paypal/form";
import { PaypalFormProps } from "./apps/paypal/models";
import { PaymentAppFormProps } from "@vivid/types";

export const PaymentAppForms: Record<
  string,
  (props: PaymentAppFormProps<any>) => ReactNode
> = {
  [PAYPAL_APP_NAME]: (props) => <PaypalForm {...props} />,
};
