"use client";

import { MeetingOption } from "@/models/meetingOption";
import React from "react";
import { MeetingsCard } from "./meetings.card";
import { Schedule } from "./schedule";

export type MeetingsProps = {
  meetings: MeetingOption[];
  meetingsClassName?: string;
};

export const Meetings: React.FC<MeetingsProps> = ({
  meetings,
  meetingsClassName,
}) => {
  const [option, setOption] = React.useState<string | undefined>();
  const meetingOption = meetings.find((m) => m.slug === option);

  return (
    <>
      {!meetingOption ? (
        <MeetingsCard
          meetings={meetings}
          onSelect={setOption}
          className={meetingsClassName}
        />
      ) : (
        <Schedule
          meetingOption={meetingOption}
          back={() => setOption(undefined)}
        />
      )}
    </>
  );
};
