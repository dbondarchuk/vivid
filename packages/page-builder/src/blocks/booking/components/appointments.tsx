"use client";

import React from "react";
import { AppointmentsCard } from "./appointments-card";
import { Schedule } from "./schedule";
import { AppointmentChoice, FieldSchema } from "@vivid/types";
import { useSearchParams } from "next/navigation";
import { cn } from "@vivid/ui";

export type AppointmentsProps = {
  options: AppointmentChoice[];
  optionsClassName?: string;
  successPage?: string;
  fieldsSchema: Record<string, FieldSchema>;
  timeZone: string;
  showPromoCode?: boolean;
  className?: string;
};

export const Appointments: React.FC<AppointmentsProps> = ({
  options,
  optionsClassName,
  successPage,
  fieldsSchema,
  timeZone,
  showPromoCode,
  className,
}) => {
  const fromQuery = useSearchParams().get("option");
  const [option, setOption] = React.useState<string | null>(fromQuery);
  const selected = options.find((m) => m._id === option);

  return (
    <>
      {!selected ? (
        <AppointmentsCard
          options={options}
          onSelect={setOption}
          className={cn(className, optionsClassName)}
        />
      ) : (
        <Schedule
          className={className}
          appointmentOption={selected}
          successPage={successPage}
          goBack={() => setOption(null)}
          fieldsSchema={fieldsSchema}
          timeZone={timeZone}
          showPromoCode={showPromoCode}
        />
      )}
    </>
  );
};
