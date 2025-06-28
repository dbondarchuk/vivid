import { z } from "zod";

export const paypalButtonsShape = ["rect", "pill", "sharp"] as const;
export const paypalButtonLayout = ["vertical", "horizontal"] as const;
export const paypalButtonColor = [
  "gold",
  "blue",
  "silver",
  "white",
  "black",
] as const;
export const paypalButtonLabel = ["paypal", "pay"] as const;

export const paypalConfigurationSchema = z.object({
  clientId: z.string().min(1, "paypal.clientId.required"),
  secretKey: z.string().min(1, "paypal.secretKey.required"),
  buttonStyle: z.object({
    shape: z.enum(paypalButtonsShape, {
      message: "paypal.buttonStyle.shape.invalid",
    }),
    layout: z.enum(paypalButtonLayout, {
      message: "paypal.buttonStyle.layout.invalid",
    }),
    color: z.enum(paypalButtonColor, {
      message: "paypal.buttonStyle.color.invalid",
    }),
    label: z.enum(paypalButtonLabel, {
      message: "paypal.buttonStyle.label.invalid",
    }),
  }),
});

export type PaypalConfiguration = z.infer<typeof paypalConfigurationSchema>;

export type PaypalFormProps = Omit<PaypalConfiguration, "secretKey"> & {
  isSandbox: boolean;
};

export const createOrderRequestSchema = z.object({
  paymentIntentId: z.string().min(1, "paypal.paymentIntentId.required"),
});

export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;

export const captureOrderRequestSchema = z.object({
  orderId: z.string().min(1, "paypal.orderId.required"),
  paymentIntentId: z.string().min(1, "paypal.paymentIntentId.required"),
});

export type CaptureOrderRequest = z.infer<typeof captureOrderRequestSchema>;
