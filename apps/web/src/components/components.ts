import { ClientComponents } from "./clientComponents";
import { Redirect } from "./web/mdx/redirect";
import { PageList, PagePublishDate, PageTags, PageTitle } from "./web/pages";
import { Booking } from "./web/schedule/booking";
import { BookingConfirmation } from "./web/schedule/confirmation";

export const Components = {
  ...ClientComponents,
  Booking,
  BookingConfirmation,
  Redirect,
  PageList,
  PagePublishDate,
  PageTitle,
  PageTags,
};
