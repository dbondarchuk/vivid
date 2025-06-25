"use client";

import { I18nFn, useI18n } from "@vivid/i18n";
import { AppointmentStatus, okStatus } from "@vivid/types";
import { Button, ButtonProps, cn, Spinner, toastPromise } from "@vivid/ui";
import { useRouter } from "next/navigation";
import React from "react";
import { changeAppointmentStatus } from "./actions";

export const changeStatus = async (
  _id: string,
  status: AppointmentStatus,
  t: I18nFn<"admin">,
  setIsLoading: (isLoading: boolean) => void,
  refresh: () => void,
  onSuccess?: (newStatus: AppointmentStatus) => void,
  beforeRequest?: () => Promise<void> | void
) => {
  setIsLoading(true);

  const fn = async () => {
    if (beforeRequest) {
      const result = beforeRequest();
      if (result instanceof Promise) await result;
    }

    const res = await changeAppointmentStatus(_id, status);
    if (res !== okStatus) throw new Error("Request failed");
  };

  try {
    await toastPromise(fn(), {
      success: t("appointments.actionButton.changesSaved"),
      error: t("appointments.actionButton.requestError"),
    });
    refresh();
    onSuccess?.(status);
  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

export const AppointmentActionButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    _id: string;
    status: AppointmentStatus;
    onSuccess?: (newStatus: AppointmentStatus) => void;
    beforeRequest?: () => Promise<void> | void;
  }
>(
  (
    {
      _id,
      status,
      onSuccess,
      beforeRequest,
      onClick: originalOnClick,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();

    const t = useI18n("admin");

    const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      await changeStatus(
        _id,
        status,
        t,
        setIsLoading,
        router.refresh,
        (newStatus) => {
          onSuccess?.(newStatus);
          originalOnClick?.(e);
        },
        beforeRequest
      );
    };

    return (
      <Button
        {...props}
        disabled={isLoading || props.disabled}
        ref={ref}
        onClick={onClick}
        className={cn(
          "inline-flex flex-row gap-1 items-center",
          props.className
        )}
      >
        {isLoading && <Spinner />}
        {props.children}
      </Button>
    );
  }
);
AppointmentActionButton.displayName = "AppointmentActionButton";
