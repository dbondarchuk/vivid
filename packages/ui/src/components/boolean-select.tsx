import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export type BooleanSelectProps = {
  value?: boolean;
  onValueChange: (value: boolean) => void;
  trueLabel?: React.ReactNode;
  falseLabel?: React.ReactNode;
  className?: string;
  placeholder?: string;
};

export const BooleanSelect: React.FC<BooleanSelectProps> = ({
  value,
  onValueChange,
  trueLabel = "Yes",
  falseLabel = "No",
  className,
  placeholder = "Select option",
}) => {
  return (
    <Select
      value={value?.toString()}
      onValueChange={(value) => onValueChange(value === "true")}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="false">{falseLabel}</SelectItem>
        <SelectItem value="true">{trueLabel}</SelectItem>
      </SelectContent>
    </Select>
  );
};
