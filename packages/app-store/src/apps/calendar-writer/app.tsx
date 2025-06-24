import { App } from "@vivid/types";
import { CalendarPlus } from "lucide-react";
import { CALENDAR_WRITER_APP_NAME } from "./const";
import { CalendarWriterAppSetup } from "./setup";

export const CalendarWriterApp: App = {
  name: CALENDAR_WRITER_APP_NAME,
  displayName: "calendarWriter.displayName",
  category: ["categories.notifications"],
  scope: ["appointment-hook"],
  type: "basic",
  Logo: ({ className }) => <CalendarPlus className={className} />,
  SetUp: (props) => <CalendarWriterAppSetup {...props} />,
  isFeatured: false,
  isHidden: false,
  dontAllowMultiple: true,
  description: {
    text: "calendarWriter.description",
  },
};
