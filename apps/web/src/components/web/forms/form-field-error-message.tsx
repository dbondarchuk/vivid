import { TranslationKeys, useI18n } from "@vivid/i18n";
import { cn, useFormField } from "@vivid/ui";
import React from "react";

export const FormFieldErrorMessage = React.forwardRef<
  HTMLParagraphElement,
  Exclude<React.HTMLAttributes<HTMLParagraphElement>, "children">
>(({ className, ...props }, ref) => {
  const i18n = useI18n("translation");
  const { error, formMessageId } = useFormField();
  const body = error?.message;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {i18n(body as TranslationKeys)}
    </p>
  );
});

FormFieldErrorMessage.displayName = "FormFieldErrorMessage";
