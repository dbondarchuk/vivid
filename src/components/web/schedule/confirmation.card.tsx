import { withI18n } from "@/i18n/withI18n";
import { ReactNode } from "react";
import { BaseCard, BaseCardProps } from "./baseCard";

export type ConfirmationCardProps = BaseCardProps & {
  duration: number;
  fields: Record<string, any>;
};

class _ConfirmationCard extends BaseCard<ConfirmationCardProps> {
  public get isPrevDisabled(): boolean {
    return true;
  }

  public get isNextDisabled(): boolean {
    return true;
  }

  public get cardContent(): ReactNode {
    return (
      <div className="relative text-center">
        <div className="mb-3">
          <h2>{this.props.i18n("confirmation_success_title")}</h2>
        </div>
        <div className="flex flex-row gap-2 justify-around flex-wrap">
          {this.props.i18n("confirmation_success_message", {
            name: this.props.fields.name,
          })}
        </div>
      </div>
    );
  }
}

export const ConfirmationCard = withI18n(_ConfirmationCard);
