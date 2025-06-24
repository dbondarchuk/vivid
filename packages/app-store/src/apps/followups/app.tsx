import type { AppsKeys } from "@vivid/i18n";
import type { App } from "@vivid/types";
import { MessageSquareHeart } from "lucide-react";
import { FOLLOW_UPS_APP_NAME } from "./const";
import { EditFollowUpPage } from "./edit-page";
import { NewFollowUpPage } from "./new-page";
import { FollowUpsPage } from "./page";

const followUpBreadcrumb = {
  title: "followUps.title" as AppsKeys,
  link: "/admin/dashboard/communications/follow-ups",
};

export const FollowUpsApp: App = {
  name: FOLLOW_UPS_APP_NAME,
  displayName: "followUps.displayName",
  scope: ["scheduled"],
  type: "complex",
  category: ["categories.notifications"],
  Logo: ({ className }) => <MessageSquareHeart className={className} />,
  dontAllowMultiple: true,
  description: {
    text: "followUps.description",
  },
  // isHidden: true,
  menuItems: [
    {
      href: "communications/follow-ups",
      parent: "communications",
      id: "communications-follow-ups",
      order: 100,
      notScrollable: true,
      label: "navigation.follow-ups",
      icon: <MessageSquareHeart />,
      Page: (props) => <FollowUpsPage {...props} />,
      pageBreadcrumbs: [followUpBreadcrumb],
      pageTitle: "followUps.title",
      pageDescription: "followUps.description",
    },
    {
      href: "communications/follow-ups/new",
      parent: "communications",
      id: "communications-follow-ups-new",
      isHidden: true,
      label: "navigation.follow-ups",
      icon: <MessageSquareHeart />,
      Page: (props) => <NewFollowUpPage {...props} />,
      pageBreadcrumbs: [
        followUpBreadcrumb,
        {
          title: "followUps.new",
          link: "/admin/dashboard/communications/follow-ups/new",
        },
      ],
      pageTitle: "followUps.new",
      pageDescription: "followUps.newDescription",
    },
    {
      href: "communications/follow-ups/edit",
      parent: "communications",
      id: "communications-follow-ups-new",
      isHidden: true,
      label: "navigation.follow-ups",
      icon: <MessageSquareHeart />,
      Page: (props) => <EditFollowUpPage {...props} />,
      pageBreadcrumbs: [
        followUpBreadcrumb,
        {
          title: "followUps.edit",
          link: "/admin/dashboard/communications/follow-ups/edit",
        },
      ],
      pageTitle: "followUps.edit",
      pageDescription: "followUps.editDescription",
    },
  ],
  settingsHref: "communications/follow-ups",
};
