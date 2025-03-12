"use client";

import React from "react";
import { AppointmentsCard } from "./appointments-card";
import { Schedule } from "./schedule";
import { AppointmentChoice, FieldSchema } from "@vivid/types";

export type AppointmentsProps = {
  options: AppointmentChoice[];
  optionsClassName?: string;
  successPage?: string;
  fieldsSchema: Record<string, FieldSchema>;
  timezone: string;
};

export const Appointments: React.FC<AppointmentsProps> = ({
  options,
  optionsClassName,
  successPage,
  fieldsSchema,
  timezone,
}) => {
  const [option, setOption] = React.useState<string | undefined>();
  const selected = options.find((m) => m.id === option);

  return (
    <>
      {!selected ? (
        <AppointmentsCard
          options={options}
          onSelect={setOption}
          className={optionsClassName}
        />
      ) : (
        <Schedule
          appointmentOption={selected}
          successPage={successPage}
          back={() => setOption(undefined)}
          fieldsSchema={fieldsSchema}
          timezone={timezone}
        />
      )}
    </>
  );
};
