"use client";
import { GetAppointmentOptionsResponse } from "@vivid/types";
import React from "react";
import { Appointments } from "./appointments";
import { Skeleton } from "@vivid/ui";
import { BookingProps } from "./types";

export const Booking: React.FC<BookingProps & { id?: string }> = ({
  successPage,
  className,
  id,
}) => {
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
      <div className={className} id={id}>
        <Skeleton className="w-full h-48" />
        <Skeleton className="w-full h-48" />
        <Skeleton className="w-full h-48" />
      </div>
    );

  return (
    <Appointments
      id={id}
      className={className}
      options={response.options}
      successPage={successPage ?? undefined}
      fieldsSchema={response.fieldsSchema}
      timeZone={response.timeZone}
      showPromoCode={response.showPromoCode}
    />
  );
};
