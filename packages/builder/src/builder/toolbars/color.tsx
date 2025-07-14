import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  ToolbarButton,
  useOpenState,
} from "@vivid/ui";
import { destructAndReplace, resolveProperty } from "@vivid/utils";
import { Leaves } from "@vivid/types";
import { ReactNode } from "react";
import { Sketch } from "@uiw/react-color";
import { ConfigurationProps } from "../../documents/types";
import { X } from "lucide-react";
import { useI18n } from "@vivid/i18n";

export type ToolbarColorPropsValues<T> = ConfigurationProps<T> &
  (
    | {
        defaultValue: string;
        nullable?: false;
      }
    | {
        defaultValue?: string | null;
        nullable: true;
      }
  );

export type ToolbarColorProps<T> = ToolbarColorPropsValues<T> & {
  property: Leaves<T>;
  tooltip: string;
  icon: ReactNode;
};

export const ToolbarColorMenu = <T,>({
  data,
  setData,
  defaultValue,
  icon,
  property,
  tooltip,
  nullable,
}: ToolbarColorProps<T>) => {
  const openState = useOpenState();
  const propValue = resolveProperty(data, property);
  const t = useI18n("ui");
  return (
    <DropdownMenu modal={false} {...openState}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={openState.open} tooltip={tooltip} isDropdown>
          {icon}
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="flex flex-col gap-2" align="start">
        <Button
          variant="ghost"
          className="self-end size-6 [&>svg]:size-4 p-0"
          aria-label={t("common.close")}
          onClick={() => {
            openState.onOpenChange(false);
          }}
        >
          <X />
        </Button>
        <Sketch
          className="!shadow-none"
          color={propValue ?? defaultValue}
          onChange={(value) => {
            setData(
              destructAndReplace(data, property, value.hex) as unknown as any
            );
          }}
          disableAlpha
        />
        {nullable && (
          <Button
            variant="ghost"
            onClick={() => {
              setData(
                destructAndReplace(data, property, null) as unknown as any
              );
            }}
          >
            <X size={16} /> {t("common.clear")}
          </Button>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
