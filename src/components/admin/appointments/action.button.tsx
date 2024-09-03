"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { AppointmentStatus } from "@/types";
import React from "react";
import { changeAppointmentStatus } from "./actions";

export const AppointmentActionButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { _id: string; status: AppointmentStatus }
>(({ _id, status, ...props }, ref) => {
  return (
    <Button onClick={() => changeAppointmentStatus(_id, status)} {...props} />
  );
});
AppointmentActionButton.displayName = "AppointmentActionButton";
