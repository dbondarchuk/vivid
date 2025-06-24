"use client";

import { UploadedFile } from "@vivid/types";
import React from "react";
import { AssetSelectorDialog } from "./assets-selector-dialog";
import { Button } from "./button";
import { Input } from "./input";
import {
  InputGroup,
  InputGroupInput,
  InputGroupInputClasses,
  InputGroupSuffixClasses,
} from "./input-group";
import { useI18n } from "@vivid/i18n";

export type AssetSelectorInputProps = {
  value?: string | null;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  accept?: string;
  fullUrl?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

export const AssetSelectorInput: React.FC<AssetSelectorInputProps> = ({
  value,
  onBlur,
  onChange,
  accept,
  placeholder,
  disabled,
  fullUrl,
  className,
}) => {
  const t = useI18n("ui");
  const [open, setIsOpen] = React.useState(false);

  const select = (asset: UploadedFile) => {
    onChange?.(fullUrl ? asset.url : `/assets/${asset.filename}`);
    onBlur?.();
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  return (
    <InputGroup className={className}>
      <AssetSelectorDialog
        accept={accept ? [accept] : undefined}
        isOpen={open}
        close={() => setIsOpen(false)}
        onSelected={select}
      />
      <InputGroupInput>
        <Input
          disabled={disabled}
          placeholder={placeholder}
          className={InputGroupInputClasses()}
          value={value ?? undefined}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
        />
      </InputGroupInput>
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        className={InputGroupSuffixClasses()}
        onClick={openDialog}
      >
        {t("form.select")}
      </Button>
    </InputGroup>
  );
};
