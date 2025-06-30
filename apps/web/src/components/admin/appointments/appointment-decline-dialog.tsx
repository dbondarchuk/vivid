"use client";

import {
  getPaymentDescription,
  getPaymentMethod,
  getPaymentMethodIcon,
  getPaymentStatusColor,
  getPaymentStatusIcon,
} from "@/components/payments/payment-card";
import { useI18n, useLocale } from "@vivid/i18n";
import { Appointment, AppointmentStatus, Payment } from "@vivid/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Card,
  CardContent,
  Checkbox,
  cn,
  ScrollArea,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@vivid/ui";
import { formatAmountString } from "@vivid/utils";
import { CalendarX2 } from "lucide-react";
import { DateTime } from "luxon";
import React from "react";
import { AppointmentActionButton } from "./action-button";

export const AppointmentDeclineDialog: React.FC<{
  appointment: Appointment;
  trigger?: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
  onSuccess?: (status: AppointmentStatus) => void;
}> = ({ appointment, open, trigger, onClose, onSuccess }) => {
  const t = useI18n();

  const locale = useLocale();
  const [isLoading, setIsLoading] = React.useState(false);

  const onOpenChange = (open: boolean) => {
    if (!open) onClose?.();
  };

  const [paymentsIdsSelectionState, setPaymentsIdsSelectionState] =
    React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    setPaymentsIdsSelectionState({});
  }, [setPaymentsIdsSelectionState, open]);

  const selectedPaymentsIds = Object.keys(paymentsIdsSelectionState).filter(
    (id) => !!paymentsIdsSelectionState[id]
  );

  const setSelected = (id: string, selected?: boolean) => {
    setPaymentsIdsSelectionState((prev) => {
      return {
        ...prev,
        [id]: typeof selected === "undefined" ? !prev[id] : selected,
      };
    });
  };

  const paymentsAvailableToRefund = React.useMemo(
    () =>
      appointment.payments?.filter(
        (payment) => payment.type === "online" && payment.status === "paid"
      ) ?? [],
    [appointment]
  );

  const refundSelected = async () => {
    const response = await fetch("/admin/api/payments/refund", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ids: Object.keys(paymentsIdsSelectionState).filter(
          (id) => !!paymentsIdsSelectionState[id]
        ),
      }),
    });

    if (response.status >= 400) {
      const text = await response.text();
      console.error(text);

      throw new Error(text);
    }

    const result = (await response.json()) as {
      success: boolean;
      updatedPayments: Record<string, Payment>;
      errors: Record<string, string>;
    };

    for (const [id, updated] of Object.entries(result.updatedPayments)) {
      const payment = appointment.payments?.find((p) => p._id === id);
      if (!payment) continue;

      Object.assign(payment, updated);
      setSelected(id, false);
    }

    if (!result.success) {
      console.error(`Refunds failed:`, result.errors);
      throw new Error(t("admin.appointments.declineDialog.refundError"));
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        if (!isLoading) onOpenChange(open);
      }}
    >
      {!!trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className="md:max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("admin.appointments.declineDialog.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("admin.appointments.declineDialog.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="flex flex-col gap-2">
            <div className="bg-muted text-foreground font-light rounded-lg p-4 flex flex-col gap-2">
              <h4 className="font-semibold mb-3">
                {t("admin.appointments.declineDialog.appointmentDetails")}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="">
                    {t("admin.appointments.declineDialog.customer")}
                  </span>
                  <span className="font-semibold">
                    {appointment.fields.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="">
                    {t("admin.appointments.declineDialog.service")}
                  </span>
                  <span className="font-semibold">
                    {appointment.option.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="">
                    {t("admin.appointments.declineDialog.dateTime")}
                  </span>
                  <span className="font-semibold">
                    {DateTime.fromJSDate(appointment.dateTime).toLocaleString(
                      DateTime.DATETIME_MED_WITH_WEEKDAY,
                      { locale }
                    )}
                  </span>
                </div>
              </div>
            </div>
            {!!paymentsAvailableToRefund.length && (
              <div className="flex flex-col gap-2">
                <div className="font-semibold">
                  {t("admin.appointments.declineDialog.refundPayments")}
                </div>

                <div className="flex flex-row flex-wrap gap-2">
                  {paymentsAvailableToRefund.map((payment) => {
                    const dateTime =
                      typeof payment.paidAt === "string"
                        ? DateTime.fromISO(payment.paidAt)
                        : DateTime.fromJSDate(payment.paidAt);

                    return (
                      <Card
                        className={cn(
                          "w-full cursor-pointer",
                          paymentsIdsSelectionState[payment._id] &&
                            "bg-blue-50 dark:bg-sky-600/20"
                        )}
                        key={payment._id}
                        onClick={() =>
                          payment.status === "paid" && setSelected(payment._id)
                        }
                      >
                        <CardContent className="p-6 relative">
                          {payment.status === "paid" && (
                            <Checkbox
                              id={`payment-${payment._id}`}
                              checked={!!paymentsIdsSelectionState[payment._id]}
                              className="absolute top-1 left-1"
                            />
                          )}

                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              {getPaymentMethodIcon(
                                payment.type,
                                "appName" in payment
                                  ? payment.appName
                                  : undefined
                              )}
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {t(
                                    getPaymentMethod(
                                      payment.type,
                                      "appName" in payment
                                        ? payment.appName
                                        : undefined
                                    )
                                  )}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {t(
                                    `admin.${getPaymentDescription(
                                      payment.description
                                    )}`
                                  )}
                                </p>
                              </div>
                            </div>
                            <Badge
                              className={getPaymentStatusColor(payment.status)}
                            >
                              <div className="flex items-center space-x-1">
                                {getPaymentStatusIcon(payment.status)}
                                <span className="capitalize">
                                  {t(
                                    `admin.common.labels.paymentStatus.${payment.status}`
                                  )}
                                </span>
                              </div>
                            </Badge>
                          </div>

                          <Separator className="my-4" />

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-foreground/80">
                                {t("admin.appointments.declineDialog.amount")}
                              </span>
                              <span className="font-semibold text-lg">
                                ${formatAmountString(payment.amount)}
                              </span>
                            </div>
                            {"externalId" in payment && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-foreground/80">
                                  {t(
                                    "admin.appointments.declineDialog.transactionId"
                                  )}
                                </span>
                                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                                  {payment.externalId}
                                </span>
                              </div>
                            )}

                            <div className="flex justify-between items-center text-sm">
                              <span className="text-foreground/80">
                                {t("admin.appointments.declineDialog.timePaid")}
                              </span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="text-sm text-foreground/60 underline decoration-dashed cursor-help">
                                      {dateTime.setLocale(locale).toRelative()}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {dateTime.toLocaleString(
                                      DateTime.DATETIME_MED,
                                      { locale }
                                    )}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t("admin.appointments.declineDialog.cancel")}
          </AlertDialogCancel>
          {!!paymentsAvailableToRefund.length && (
            <AlertDialogAction asChild variant="destructive">
              <AppointmentActionButton
                _id={appointment._id}
                status="declined"
                disabled={!selectedPaymentsIds.length || isLoading}
                className="mt-2 sm:mt-0"
                beforeRequest={() => refundSelected()}
                setIsLoading={setIsLoading}
                onSuccess={onSuccess}
              >
                <CalendarX2 size={20} />
                {t("admin.appointments.declineDialog.declineAndRefund", {
                  count: selectedPaymentsIds.length,
                  payment:
                    selectedPaymentsIds.length !== 1
                      ? t("admin.appointments.declineDialog.payments")
                      : t("admin.appointments.declineDialog.payment"),
                })}
              </AppointmentActionButton>
            </AlertDialogAction>
          )}
          <AlertDialogAction asChild variant="destructive">
            <AppointmentActionButton
              _id={appointment._id}
              status="declined"
              disabled={isLoading}
              setIsLoading={setIsLoading}
              onSuccess={onSuccess}
            >
              <CalendarX2 size={20} />
              {t("admin.appointments.declineDialog.decline")}
            </AppointmentActionButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
