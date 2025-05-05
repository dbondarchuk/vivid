"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@vivid/ui";
import { DateTime } from "luxon";
import React from "react";
import { useCookies } from "react-cookie";

const shownCookieValue = "shown";

export type PopupProps = {
  id: string;
  title: string;
  description?: string;
  buttonText?: string;
  className?: string;
  children: React.ReactNode | React.ReactNode[];
  show?: "once" | "always";
};

export const Popup: React.FC<PopupProps> = ({
  id,
  className,
  title,
  description,
  buttonText = "Okay",
  show = "always",
  children,
}) => {
  const COOKIE_NAME = `popup-shown-${id}`;

  const [cookies, setCookies] = useCookies<
    typeof COOKIE_NAME,
    Record<string, string | undefined>
  >([COOKIE_NAME]);

  const showPopup =
    show === "always" || cookies[COOKIE_NAME] !== shownCookieValue;

  const onClose = (isOpen: boolean) => {
    if (isOpen) return;

    setCookies(COOKIE_NAME, shownCookieValue, {
      expires: DateTime.now().plus({ years: 1 }).toJSDate(),
    });
  };

  return (
    <Dialog defaultOpen={showPopup} modal onOpenChange={onClose}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="w-full">{children}</div>
        <DialogFooter>
          <DialogClose>{buttonText}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
