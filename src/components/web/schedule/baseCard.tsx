import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IWithI18nProps } from "@/i18n/withI18n";
import { MeetingOption } from "@/models/meetingOption";
import { DollarSign, Timer } from "lucide-react";
import React from "react";

export type BaseCardProps = IWithI18nProps & {
  next?: () => void;
  prev?: () => void;

  meetingOption: MeetingOption;
};

export type BaseCardState = {};

export abstract class BaseCard<
  P extends BaseCardProps = BaseCardProps,
  S extends BaseCardState = BaseCardState
> extends React.Component<P, S> {
  public abstract get isPrevDisabled(): boolean;
  public abstract get isNextDisabled(): boolean;

  public abstract get cardContent(): React.ReactNode;

  public render(): React.ReactNode {
    return (
      <Card className="sm:min-w-min md:w-full">
        <CardHeader className="text-center">
          <CardTitle>{this.props.meetingOption.name}</CardTitle>
          <CardDescription>
            {this.props.meetingOption.description}
          </CardDescription>
          {(this.props.meetingOption.duration ||
            this.props.meetingOption.price) && (
            <CardDescription className="flex flex-row gap-2 justify-center place-items-center">
              {this.props.meetingOption.duration && (
                <div className="flex flex-row items-center">
                  <Timer className="mr-1" />
                  {this.props.i18n(
                    "duration_min_format",
                    this.props.meetingOption.duration
                  )}
                </div>
              )}
              {this.props.meetingOption.price && (
                <div className="flex flex-row items-center">
                  <DollarSign className="mr-1" />
                  {this.props.meetingOption.price
                    .toFixed(2)
                    .replace(/\.00$/, "")}
                </div>
              )}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>{this.cardContent}</CardContent>
        <CardFooter className="w-100 flex justify-between">
          <div>
            {this.props.prev && (
              <Button
                variant={"outline"}
                disabled={this.isPrevDisabled}
                onClick={() => this.props.prev?.()}
              >
                {this.props.i18n("back_button")}
              </Button>
            )}
          </div>
          <div>
            {this.props.next && (
              <Button
                variant={"outline"}
                disabled={this.isNextDisabled}
                onClick={() => this.props.next?.()}
              >
                {this.props.i18n("next_button")}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  }
}
