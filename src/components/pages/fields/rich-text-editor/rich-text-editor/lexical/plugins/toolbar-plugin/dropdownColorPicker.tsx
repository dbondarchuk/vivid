/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from "react";

import ColorPicker from "../../editor/ui/ColorPicker";
import {
  DropdownContent,
  DropdownMenu,
  DropdownTrigger,
} from "../../ui/dropdownMenu";

type Props = {
  disabled?: boolean;
  buttonAriaLabel?: string;
  buttonClassName?: string;
  buttonIcon: React.ReactNode;
  buttonLabel?: string;
  title?: string;
  stopCloseOnClickSelf?: boolean;
  color: string;
  onChange?: (color: string, skipHistoryStack: boolean) => void;
};

export default function DropdownColorPicker({
  disabled = false,
  stopCloseOnClickSelf = true,
  color,
  buttonAriaLabel,
  buttonClassName,
  buttonIcon,
  title,
  onChange,
  ...rest
}: Props) {
  return (
    <DropdownMenu>
      <DropdownTrigger title={title} aria-label={buttonAriaLabel}>
        {buttonIcon}
      </DropdownTrigger>
      <DropdownContent>
        <ColorPicker color={color} onChange={onChange} />
      </DropdownContent>
    </DropdownMenu>
  );
}
