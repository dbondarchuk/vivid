import { App } from "@vivid/types";
import { MessageSquareHeart } from "lucide-react";
import { FOLLOW_UPS_APP_NAME } from "./const";
import { EditFollowUpPage } from "./edit-page";
import { NewFollowUpPage } from "./new-page";
import { FollowUpsPage } from "./page";

const followUpBreadcrumb = {
  title: "Follow-ups",
  link: "/admin/dashboard/communications/follow-ups",
};

export const FollowUpsApp: App = {
  name: FOLLOW_UPS_APP_NAME,
  displayName: "Customer follow-ups",
  scope: ["scheduled"],
  type: "complex",
  category: ["Notifications"],
  Logo: ({ className }) => <MessageSquareHeart className={className} />,
  dontAllowMultiple: true,
  description: {
    text: "Send follow-up messages after appointments",
  },
  // isHidden: true,
  menuItems: [
    {
      href: "communications/follow-ups",
      parent: "communications",
      id: "communications-follow-ups",
      order: 100,
      notScrollable: true,
      label: "Follow-ups",
      icon: <MessageSquareHeart />,
      Page: (props) => <FollowUpsPage {...props} />,
      pageBreadcrumbs: [followUpBreadcrumb],
      pageTitle: "Follow-ups",
      pageDescription: "Add or update appointment follow-ups",
    },
    {
      href: "communications/follow-ups/new",
      parent: "communications",
      id: "communications-follow-ups-new",
      isHidden: true,
      label: "Follow-ups",
      icon: <MessageSquareHeart />,
      Page: (props) => <NewFollowUpPage {...props} />,
      pageBreadcrumbs: [
        followUpBreadcrumb,
        {
          title: "New follow-up",
          link: "/admin/dashboard/communications/follow-ups/new",
        },
      ],
      pageTitle: "New follow-up",
      pageDescription: "Create new appointment follow-up",
    },
    {
      href: "communications/follow-ups/edit",
      parent: "communications",
      id: "communications-follow-ups-new",
      isHidden: true,
      label: "Follow-ups",
      icon: <MessageSquareHeart />,
      Page: (props) => <EditFollowUpPage {...props} />,
      pageBreadcrumbs: [
        followUpBreadcrumb,
        {
          title: "Edit follow-up",
          link: "/admin/dashboard/communications/follow-ups/edit",
        },
      ],
      pageTitle: "Edit follow-up",
      pageDescription: "Update appointment follow-up",
    },
  ],
  settingsHref: "communications/follow-ups",
};
