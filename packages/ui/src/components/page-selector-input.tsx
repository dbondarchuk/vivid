"use client";

import { useI18n } from "@vivid/i18n";
import { PageListModelWithUrl } from "@vivid/types";
import { VariantProps } from "class-variance-authority";
import React from "react";
import { Button } from "./button";
import { Input, inputVariants } from "./input";
import {
  InputGroup,
  InputGroupInput,
  InputGroupInputClasses,
  InputGroupSuffixClasses,
} from "./input-group";
import { PageSelectorDialog } from "./page-selector-dialog";

export type PageSelectorInputProps = {
  value?: string | null;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  fullUrl?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
} & VariantProps<typeof inputVariants>;

export const PageSelectorInput: React.FC<PageSelectorInputProps> = ({
  value,
  onBlur,
  onChange,
  placeholder,
  disabled,
  fullUrl,
  className,
  ...rest
}) => {
  const t = useI18n("ui");
  const [open, setIsOpen] = React.useState(false);

  const select = (page: PageListModelWithUrl) => {
    onChange?.(fullUrl ? page.url : `/${page.slug}`);
    onBlur?.();
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  return (
    <InputGroup className={className}>
      <PageSelectorDialog
        isOpen={open}
        close={() => setIsOpen(false)}
        onSelected={select}
      />
      <InputGroupInput>
        <Input
          disabled={disabled}
          placeholder={placeholder}
          {...rest}
          className={InputGroupInputClasses()}
          value={value ?? undefined}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
        />
      </InputGroupInput>
      <Button
        type="button"
        variant="outline"
        size={rest.h}
        disabled={disabled}
        className={InputGroupSuffixClasses()}
        onClick={openDialog}
      >
        {t("form.select")}
      </Button>
    </InputGroup>
  );
};
