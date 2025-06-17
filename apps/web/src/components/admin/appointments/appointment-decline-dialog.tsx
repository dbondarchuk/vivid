"use client";

import {
  getPaymentDescription,
  getPaymentMethod,
  getPaymentMethodIcon,
  getPaymentStatusColor,
  getPaymentStatusIcon,
} from "@/components/payments/payment-card";
import { Appointment, Payment } from "@vivid/types";
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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Checkbox,
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
}> = ({ appointment, open, trigger, onClose }) => {
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
      throw new Error("One or more refund requests have failed.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {!!trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Decline appointment</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently decline this
            appointment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="flex flex-col gap-2">
            <div className="bg-muted text-foreground font-light rounded-lg p-4 flex flex-col gap-2">
              <h4 className="font-semibold mb-3">Appointment details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="">Customer</span>
                  <span className="font-semibold">
                    {appointment.fields.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="">Service</span>
                  <span className="font-semibold">
                    {appointment.option.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="">Date &amp; Time</span>
                  <span className="font-semibold">
                    {DateTime.fromJSDate(appointment.dateTime).toLocaleString(
                      DateTime.DATETIME_MED_WITH_WEEKDAY
                    )}
                  </span>
                </div>
              </div>
            </div>
            {!!paymentsAvailableToRefund.length && (
              <div className="flex flex-col gap-2">
                <div className="font-semibold">Refund payments</div>

                <div className="flex flex-row flex-wrap gap-2">
                  {paymentsAvailableToRefund.map((payment) => {
                    const dateTime =
                      typeof payment.paidAt === "string"
                        ? DateTime.fromISO(payment.paidAt)
                        : DateTime.fromJSDate(payment.paidAt);

                    return (
                      <Card
                        className="w-full max-w-md cursor-pointer"
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
                                  {getPaymentMethod(
                                    payment.type,
                                    "appName" in payment
                                      ? payment.appName
                                      : undefined
                                  )}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {getPaymentDescription(payment.description)}
                                </p>
                              </div>
                            </div>
                            <Badge
                              className={getPaymentStatusColor(payment.status)}
                            >
                              <div className="flex items-center space-x-1">
                                {getPaymentStatusIcon(payment.status)}
                                <span className="capitalize">
                                  {payment.status}
                                </span>
                              </div>
                            </Badge>
                          </div>

                          <Separator className="my-4" />

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-foreground/80">Amount</span>
                              <span className="font-semibold text-lg">
                                ${formatAmountString(payment.amount)}
                              </span>
                            </div>
                            {"externalId" in payment && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-foreground/80">
                                  Transaction ID
                                </span>
                                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                                  {payment.externalId}
                                </span>
                              </div>
                            )}

                            <div className="flex justify-between items-center text-sm">
                              <span className="text-foreground/80">
                                Time paid
                              </span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="text-sm text-foreground/60 underline decoration-dashed cursor-help">
                                      {dateTime.toRelative()}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {dateTime.toLocaleString(
                                      DateTime.DATETIME_MED
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {!!paymentsAvailableToRefund.length && (
            <AlertDialogAction asChild variant="destructive">
              <AppointmentActionButton
                _id={appointment._id}
                status="declined"
                disabled={!selectedPaymentsIds.length}
                className="mt-2 sm:mt-0"
                beforeRequest={() => refundSelected()}
              >
                <CalendarX2 size={20} />
                Decline and refund
                {selectedPaymentsIds.length
                  ? ` ${selectedPaymentsIds.length}`
                  : ""}{" "}
                payment{selectedPaymentsIds.length !== 1 ? "s" : ""}
              </AppointmentActionButton>
            </AlertDialogAction>
          )}
          <AlertDialogAction asChild variant="destructive">
            <AppointmentActionButton _id={appointment._id} status="declined">
              <CalendarX2 size={20} />
              Decline
            </AppointmentActionButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
