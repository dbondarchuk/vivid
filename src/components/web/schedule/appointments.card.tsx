import { IWithI18nProps, withI18n } from "@/i18n/withI18n";
import { DollarSign, Timer } from "lucide-react";
import React from "react";
import { AppointmentChoice } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Markdown } from "../markdown/Markdown";

export type AppointmentsCardProps = {
  options: AppointmentChoice[];
  className?: string;
  onSelect: (slug: string) => void;
};

const _AppointmentsCard: React.FC<AppointmentsCardProps & IWithI18nProps> = ({
  options: meetings,
  className,
  onSelect,
  i18n,
}) => {
  return (
    <div className={className}>
      {meetings.map((option) => {
        return (
          <Card
            key={option.id}
            onClick={() => onSelect(option.id)}
            className="cursor-pointer"
          >
            <CardHeader>
              <CardTitle>{option.name}</CardTitle>
              <CardDescription className="flex flex-col gap-2">
                <div className="flex flex-row items-center">
                  <Timer className="mr-1" />
                  {option.duration
                    ? i18n("duration_min_format", { duration: option.duration })
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
            <CardContent>
              <Markdown markdown={option.description} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export const AppointmentsCard = withI18n(_AppointmentsCard);
