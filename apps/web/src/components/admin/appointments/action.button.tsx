"use client";

import { AppointmentStatus, okStatus } from "@vivid/types";
import { Button, ButtonProps, cn, Spinner, toast } from "@vivid/ui";
import { useRouter } from "next/navigation";
import React from "react";
import { changeAppointmentStatus } from "./actions";

export const changeStatus = (
  _id: string,
  status: AppointmentStatus,
  setIsLoading: (isLoading: boolean) => void,
  refresh: () => void,
  onSuccess?: (newStatus: AppointmentStatus) => void
) => {
  setIsLoading(true);

  changeAppointmentStatus(_id, status)
    .then((res) => {
      toast(
        res === okStatus
          ? {
              variant: "default",
              title: "Saved",
              description: "Your changes were saved.",
            }
          : {
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "There was a problem with your request.",
            }
      );

      if (res === okStatus) {
        refresh();
        onSuccess?.(status);
      }
    })
    .finally(() => setIsLoading(false));
};

export const AppointmentActionButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    _id: string;
    status: AppointmentStatus;
    onSuccess?: (newStatus: AppointmentStatus) => void;
  }
>(({ _id, status, onSuccess, onClick: originalOnClick, ...props }, ref) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    changeStatus(_id, status, setIsLoading, router.refresh, (newStatus) => {
      onSuccess?.(newStatus);
      originalOnClick?.(e);
    });
  };

  return (
    <Button
      {...props}
      disabled={isLoading || props.disabled}
      ref={ref}
      onClick={onClick}
      className={cn("inline-flex flex-row gap-1 items-center", props.className)}
    >
      {isLoading && <Spinner />}
      {props.children}
    </Button>
  );
});
AppointmentActionButton.displayName = "AppointmentActionButton";
