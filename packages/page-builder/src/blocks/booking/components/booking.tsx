"use client";
import { GetAppointmentOptionsResponse } from "@vivid/types";
import React from "react";
import { Appointments } from "./appointments";
import { Skeleton } from "@vivid/ui";

export type BookingProps = {
  successPage?: string;
  className?: string;
};

export const Booking: React.FC<BookingProps> = ({ successPage, className }) => {
  const [response, setResponse] =
    React.useState<GetAppointmentOptionsResponse | null>(null);

  React.useEffect(() => {
    const loadOptions = async () => {
      const response = await fetch("/api/booking/options");
      const data = await response.json();
      setResponse(data);
    };

    loadOptions();
  }, []);

  if (!response)
    return (
      <div className={className}>
        <Skeleton className="w-full h-48" />
        <Skeleton className="w-full h-48" />
        <Skeleton className="w-full h-48" />
      </div>
    );

  return (
    <Appointments
      className={className}
      options={response.options}
      successPage={successPage}
      fieldsSchema={response.fieldsSchema}
      timeZone={response.timeZone}
      showPromoCode={response.showPromoCode}
    />
  );
};
