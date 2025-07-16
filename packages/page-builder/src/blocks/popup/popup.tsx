"use client";

import { Dialog } from "@vivid/ui";
import { DateTime } from "luxon";
import { useCookies } from "react-cookie";
import { showPopupType } from "./schema";

const shownCookieValue = "shown";

export const Popup: React.FC<{
  blockId: string;
  show: (typeof showPopupType)[number];
  isEditor?: boolean;
  children: React.ReactNode;
}> = ({ blockId, show, isEditor, children }) => {
  const COOKIE_NAME = `popup-shown-${blockId}`;

  const [cookies, setCookies] = useCookies<
    typeof COOKIE_NAME,
    Record<string, string | undefined>
  >([COOKIE_NAME]);

  const showPopup =
    isEditor || show === "always" || cookies[COOKIE_NAME] !== shownCookieValue;

  const onClose = (isOpen: boolean) => {
    if (isOpen) return;

    setCookies(COOKIE_NAME, shownCookieValue, {
      expires: DateTime.now().plus({ years: 1 }).toJSDate(),
    });
  };

  return (
    <Dialog defaultOpen={showPopup} modal onOpenChange={onClose}>
      {children}
    </Dialog>
  );
};
