"use client";

import React from "react";
import { AppointmentsCard } from "./appointments.card";
import { Schedule } from "./schedule";
import { AppointmentChoice } from "@vivid/types";

export type AppointmentsProps = {
  options: AppointmentChoice[];
  optionsClassName?: string;
  successPage?: string;
};

export const Appointments: React.FC<AppointmentsProps> = ({
  options,
  optionsClassName,
  successPage,
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
        />
      )}
    </>
  );
};
