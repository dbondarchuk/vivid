"use client";

import { AppointmentStatus, okStatus } from "@vivid/types";
import { Button, ButtonProps, cn, Spinner, toastPromise } from "@vivid/ui";
import { useRouter } from "next/navigation";
import React from "react";
import { changeAppointmentStatus } from "./actions";

export const changeStatus = async (
  _id: string,
  status: AppointmentStatus,
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
      success: "Your changes were saved.",
      error: "There was a problem with your request.",
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
    setIsLoading?: (isLoading: boolean) => void;
  }
>(
  (
    {
      _id,
      status,
      onSuccess,
      beforeRequest,
      onClick: originalOnClick,
      setIsLoading: propsSetIsLoading,
      ...props
    },
    ref
  ) => {
    const [isLoading, stateSetIsLoading] = React.useState(false);
    const router = useRouter();

    const setIsLoading = (loading: boolean) => {
      stateSetIsLoading(loading);
      propsSetIsLoading?.(loading);
    };

    const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      await changeStatus(
        _id,
        status,
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
