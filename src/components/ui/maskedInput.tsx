import React from "react";
import InputMask from "@mona-health/react-input-mask";
import { Input, InputProps } from "./input";
export type Mask = Array<string | RegExp> | string;
export type MaskedInputProps = InputProps & {
  mask?: React.ComponentProps<typeof InputMask>["mask"];
  ref?: React.Ref<HTMLInputElement> | undefined;
};

export const MaskedInput: React.FC<MaskedInputProps> = (
  props: MaskedInputProps
) => {
  return props.mask ? (
    <InputMask
      mask={props.mask}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
    >
      <Input {...props} />
    </InputMask>
  ) : (
    <Input {...props} />
  );
};
