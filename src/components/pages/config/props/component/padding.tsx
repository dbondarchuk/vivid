import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ComponentConfig } from "@measured/puck";
import { Hash } from "lucide-react";

export type PaddingProps = {
  padding?: number[];
};

const PaddingValue = ({
  index,
  value,
  onChange,
}: {
  index: number;
  value: number[];
  onChange: (value: number[]) => void;
}) => (
  <Input
    type="number"
    defaultValue={value[index]}
    placeholder="0"
    name={`padding-${index}`}
    onChange={(e) => {
      const newArray = [...value];
      newArray[index] = parseInt(e.currentTarget.value);
      onChange(newArray);
    }}
  />
);

export const PaddingFields: ComponentConfig<PaddingProps>["fields"] = {
  padding: {
    type: "custom",
    label: "Padding",
    render: ({ onChange, value }) => {
      return (
        <div className="flex flex-col gap-3 px-1">
          <Label className="flex flex-row gap-1 items-center font-semibold">
            <Hash size={16} /> Padding
          </Label>
          <div className="grid grid-cols-4 gap-1">
            <Label className="font-semibold text-xs">Top</Label>
            <Label className="font-semibold text-xs">Right</Label>
            <Label className="font-semibold text-xs">Bottom</Label>
            <Label className="font-semibold text-xs">Left</Label>
            <PaddingValue index={0} value={value || []} onChange={onChange} />
            <PaddingValue index={1} value={value || []} onChange={onChange} />
            <PaddingValue index={2} value={value || []} onChange={onChange} />
            <PaddingValue index={3} value={value || []} onChange={onChange} />
          </div>
        </div>
      );
    },
  },
} as const;

export const PaddingVariants = {};

export const PaddingClasses = (props: PaddingProps) =>
  props.padding?.length ? ["p-[var(--editor-padding)]"] : [];

export const PaddingStyles = (props: PaddingProps) =>
  props.padding?.length
    ? {
        "--editor-padding": Array.from({ length: 4 })
          .map((_, index) => `${props.padding?.[index] || 0}px`)
          .join(" "),
      }
    : {};

export const PaddingDefaults: PaddingProps = {
  padding: [],
};
