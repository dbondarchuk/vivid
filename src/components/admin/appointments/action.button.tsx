"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { AppointmentStatus } from "@/types";
import React from "react";
import { changeAppointmentStatus } from "./actions";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { okStatus } from "@/types/general/actionStatus";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

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
>(({ _id, status, onSuccess, ...props }, ref) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const onClick = () =>
    changeStatus(_id, status, setIsLoading, router.refresh, onSuccess);

  return (
    <Button
      {...props}
      disabled={isLoading || props.disabled}
      ref={ref}
      onClick={onClick}
      className={cn("flex flex-row gap-1 items-center", props.className)}
    >
      {isLoading && <Spinner />}
      <span>{props.children}</span>
    </Button>
  );
});
AppointmentActionButton.displayName = "AppointmentActionButton";
