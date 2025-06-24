import { AvailableApps } from "@vivid/app-store";
import { Payment, PaymentStatus, PaymentType } from "@vivid/types";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  Separator,
  Spinner,
  toast,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@vivid/ui";
import { AdminKeys, AppsKeys, I18nFn, useI18n } from "@vivid/i18n";
import { formatAmountString } from "@vivid/utils";
import {
  AlertTriangle,
  Check,
  CheckCircle,
  CircleDollarSign,
  Clock,
  CreditCard,
} from "lucide-react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import React from "react";

export type PaymentCardProps = {
  payment: Payment;
};

export const getPaymentStatusIcon = (status: PaymentStatus) => {
  switch (status) {
    case "paid":
      return <CheckCircle className="size-4 text-green-600" />;
    //   case "refunded":
    //     return <Clock className="h-4 w-4 text-yellow-600" />;
    //   case "failed":
    //     return <CreditCard className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="size-4 text-gray-600" />;
  }
};

export const getPaymentStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case "paid":
      return "bg-green-100 hover:bg-green-300 text-green-800 hover:text-green-900 border-green-200 hover:border-green-400 ";
    //   case "pending":
    //     return "bg-yellow-100 text-yellow-800 border-yellow-200";
    //   case "failed":
    //     return "bg-red-100 text-red-800 border-red-200";
    case "refunded":
      return "bg-red-100 hover:bg-red-300 text-red-800 hover:text-red-900 border-red-200 hover:border-red-400 ";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getPaymentDescription = (description: string): AdminKeys => {
  switch (description) {
    case "full_payment":
      return "payment.descriptions.fullPayment";

    case "deposit":
      return "payment.descriptions.deposit";

    default:
      return description as AdminKeys;
  }
};

export const getPaymentMethod = (
  type: PaymentType,
  appName?: string
): AdminKeys | AppsKeys => {
  return type === "online" && appName
    ? AvailableApps[appName]?.displayName
    : type === "cash"
      ? "payment.methods.cash"
      : "payment.methods.card";
};

export const getPaymentMethodIcon = (type: PaymentType, appName?: string) => {
  const Icon =
    type === "online" && appName
      ? AvailableApps[appName]?.Logo
      : type === "cash"
        ? CircleDollarSign
        : CreditCard;

  return <Icon className="h-8 w-8" />;
};

export const PaymentCard: React.FC<PaymentCardProps> = ({ payment }) => {
  const {
    _id,
    amount,
    paidAt,
    description,
    status,
    type,
    refundedAt,
    ...rest
  } = payment;

  const [isRefundInProgress, setIsRefundInProgress] = React.useState(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = React.useState(false);

  const router = useRouter();
  const tAdmin = useI18n("admin");
  const tApp = useI18n("apps");

  const t: I18nFn<"admin" | "apps"> = (key, args) => {
    const adminTranslation = tAdmin(key as AdminKeys, args);
    if (adminTranslation && adminTranslation !== key) {
      return adminTranslation;
    }

    const appTranslation = tApp(key as AppsKeys, args);
    if (appTranslation && appTranslation !== key) {
      return appTranslation;
    }
    return key;
  };

  const dateTime =
    typeof paidAt === "string"
      ? DateTime.fromISO(paidAt)
      : DateTime.fromJSDate(paidAt);
  const refundedDateTime = refundedAt
    ? typeof refundedAt === "string"
      ? DateTime.fromISO(refundedAt)
      : DateTime.fromJSDate(refundedAt)
    : undefined;

  const refund = async () => {
    try {
      setIsRefundInProgress(true);

      const response = await fetch(`/admin/api/payments/${_id}/refund`, {
        method: "POST",
      });

      if (response.status >= 400) {
        const text = await response.text();
        throw new Error(
          `Refund has failed (status: ${response.status}): ${text}`
        );
      }

      const result = (await response.json()) as
        | {
            success: false;
            error: string;
          }
        | {
            success: true;
            payment: Payment;
          };

      if (!result.success) {
        throw new Error(`Refund has failed: ${result.error}`);
      }

      toast.success(tAdmin("payment.toasts.refundSuccess"), {
        description: tAdmin("payment.toasts.refundSuccessDescription"),
      });

      Object.assign(payment, result.payment);

      setIsRefundDialogOpen(false);
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error(tAdmin("payment.toasts.refundError"), {
        description: tAdmin("payment.toasts.refundErrorDescription"),
      });
    } finally {
      setIsRefundInProgress(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getPaymentMethodIcon(
              type,
              "appName" in rest ? rest.appName : undefined
            )}
            <div>
              <h3 className="font-semibold text-lg">
                {t(
                  getPaymentMethod(
                    type,
                    "appName" in rest ? rest.appName : undefined
                  )
                )}
              </h3>
              <p className="text-sm text-gray-600">
                {getPaymentDescription(description)}
              </p>
            </div>
          </div>
          <Badge className={getPaymentStatusColor(status)}>
            <div className="flex items-center space-x-1">
              {getPaymentMethodIcon(
                type,
                "appName" in rest ? rest.appName : undefined
              )}
              <span>
                {tAdmin(`common.labels.paymentStatus.${payment.status}`)}
              </span>
            </div>
          </Badge>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-foreground/80">
              {tAdmin("payment.card.amount")}
            </span>
            <span className="font-semibold text-lg">
              ${formatAmountString(amount)}
            </span>
          </div>

          {/* {fee && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Processing Fee</span>
              <span className="text-gray-800">${fee.toFixed(2)}</span>
            </div>
          )} */}

          {"externalId" in rest && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-foreground/80">
                {tAdmin("payment.card.transactionId")}
              </span>
              <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                {rest.externalId}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm">
            <span className="text-foreground/80">
              {tAdmin("payment.card.timePaid")}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm text-foreground/60 underline decoration-dashed cursor-help">
                    {dateTime.toRelative()}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {dateTime.toLocaleString(DateTime.DATETIME_MED)}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {refundedDateTime?.isValid && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-foreground/80">
                {tAdmin("payment.card.timeRefunded")}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm text-foreground/60 underline decoration-dashed cursor-help">
                      {refundedDateTime.toRelative()}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    {refundedDateTime.toLocaleString(DateTime.DATETIME_MED)}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {status === "paid" && type === "online" && (
            <div className="mt-4">
              <AlertDialog
                open={isRefundDialogOpen}
                onOpenChange={setIsRefundDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full"
                    disabled={isRefundInProgress}
                  >
                    {isRefundInProgress && <Spinner />}{" "}
                    {tAdmin("payment.card.refund")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {/* <div className="flex flex-row gap-2 items-center">
                        <div className="w-10 h-10 bg-destructive rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-destructive-foreground" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibol">
                            Confirm Refund
                          </h3>
                          <p className="text-sm text-muted-foreground font-normal">
                            This action cannot be undone
                          </p>
                        </div>
                      </div> */}
                      {tAdmin("payment.card.confirmRefund")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {tAdmin("payment.card.confirmRefundDescription")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="bg-muted text-foreground font-thin rounded-lg p-4">
                    <h4 className="font-semibold mb-3">
                      {tAdmin("payment.card.refundDetails")}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="">
                          {tAdmin("payment.card.paymentMethod")}
                        </span>
                        <span className="font-semibold">
                          {t(
                            getPaymentMethod(
                              type,
                              "appName" in rest ? rest.appName : undefined
                            )
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="">
                          {tAdmin("payment.card.originalAmount")}
                        </span>
                        <span className="font-semibold">
                          ${formatAmountString(payment.amount)}
                        </span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>{tAdmin("payment.card.refundAmount")}</span>
                          <span>${amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isRefundInProgress}>
                      {tAdmin("payment.card.cancel")}
                    </AlertDialogCancel>
                    <Button
                      variant="destructive"
                      onClick={() => refund()}
                      disabled={isRefundInProgress}
                    >
                      {isRefundInProgress && <Spinner />}{" "}
                      {tAdmin("payment.card.confirmRefundButton")}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

          {status === "refunded" && (
            <div className="mt-4">
              <Button variant="destructive" className="w-full" disabled>
                <Check /> {tAdmin("payment.card.refunded")}
              </Button>
            </div>
          )}
        </div>

        {/* {fee && (
          <>
            <Separator className="my-4" />
            <div className="flex justify-between items-center font-semibold">
              <span>Total Charged</span>
              <span className="text-lg">${(amount + fee).toFixed(2)}</span>
            </div>
          </>
        )} */}
      </CardContent>
    </Card>
  );
};
