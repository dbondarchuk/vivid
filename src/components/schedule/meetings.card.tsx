import { IWithI18nProps, withI18n } from "@/i18n/withI18n";
import { MeetingOption } from "@/models/meetingOption";
import { DollarSign, Timer } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export type MeetingsCardProps = {
  meetings: MeetingOption[];
  className?: string;
  onSelect: (slug: string) => void;
};

const _MeetingsCard: React.FC<MeetingsCardProps & IWithI18nProps> = ({
  meetings,
  className,
  onSelect,
  i18n,
}) => {
  return (
    <div className={className}>
      {meetings.map((option) => {
        return (
          <Card
            key={option.slug}
            onClick={() => onSelect(option.slug)}
            className="cursor-pointer"
          >
            <CardHeader>
              <CardTitle>{option.name}</CardTitle>
              <CardDescription className="flex flex-col gap-2">
                <div className="flex flex-row items-center">
                  <Timer className="mr-1" />
                  {option.duration
                    ? i18n("duration_min_format", option.duration)
                    : i18n("duration_custom")}
                </div>
                {option.price && (
                  <div className="flex flex-row items-center">
                    <DollarSign className="mr-1" />
                    {option.price.toFixed(2).replace(/\.00$/, "")}
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>{option.description}</CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export const MeetingsCard = withI18n(_MeetingsCard);
