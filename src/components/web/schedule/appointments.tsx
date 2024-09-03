"use client";

import React from "react";
import { AppointmentsCard } from "./appointments.card";
import { Schedule } from "./schedule";
import { AppointmentChoice } from "@/types";

export type AppointmentsProps = {
  options: AppointmentChoice[];
  optionsClassName?: string;
};

export const Appointments: React.FC<AppointmentsProps> = ({
  options,
  optionsClassName,
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
          back={() => setOption(undefined)}
        />
      )}
    </>
  );
};
