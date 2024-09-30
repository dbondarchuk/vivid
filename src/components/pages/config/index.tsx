import { Config, Data } from "@measured/puck";
import { ButtonGroup, ButtonGroupProps } from "./blocks/ButtonGroup";
import { Card, CardProps } from "./blocks/Card";
import { Columns, ColumnsProps } from "./blocks/Columns";
import { Hero, HeroProps } from "./blocks/Hero";
import { Heading, HeadingProps } from "./blocks/Heading";
import { Flex, FlexProps } from "./blocks/Flex";
import { Logos, LogosProps } from "./blocks/Logos";
import { Stats, StatsProps } from "./blocks/Stats";
import { Text, TextProps } from "./blocks/Text";
import { VerticalSpace, VerticalSpaceProps } from "./blocks/VerticalSpace";

import { RootProps, RootRenderer } from "./root";
import { Switch } from "@/components/ui/switch";
import React from "react";
import { Label } from "@/components/ui/label";

export type { RootProps } from "./root";

export type Props = {
  ButtonGroup: ButtonGroupProps;
  Card: CardProps;
  Columns: ColumnsProps;
  Hero: HeroProps;
  Heading: HeadingProps;
  Flex: FlexProps;
  Logos: LogosProps;
  Stats: StatsProps;
  Text: TextProps;
  VerticalSpace: VerticalSpaceProps;
};

export type UserConfig = Config<
  Props,
  RootProps,
  "layout" | "typography" | "interactive"
>;

export type UserData = Data<Props, RootProps>;

// We avoid the name config as next gets confused
export const conf: (
  header: React.ReactNode,
  footer: React.ReactNode
) => UserConfig = (header, footer) => ({
  root: {
    defaultProps: {
      title: "My Page",
      header: true,
      footer: true,
    },
    fields: {
      header: {
        type: "custom",
        render: ({ name, onChange, value }) => (
          <div className="flex flex-row gap-4 items-center">
            <Label htmlFor={`root-${name}`}>{name}</Label>
            <Switch
              id={`root-${name}`}
              defaultChecked={value}
              name={name}
              onCheckedChange={(e) => onChange(e)}
            />
          </div>
        ),
      },
      footer: {
        type: "custom",
        render: ({ name, onChange, value }) => (
          <div className="flex flex-row gap-4 items-center">
            <Label htmlFor={`root-${name}`}>{name}</Label>
            <Switch
              id={`root-${name}`}
              defaultChecked={value}
              name={name}
              onCheckedChange={(e) => onChange(e)}
            />
          </div>
        ),
      },
    },
    render: RootRenderer(header, footer),
  },
  categories: {
    layout: {
      components: ["Columns", "Flex", "VerticalSpace"],
    },
    typography: {
      components: ["Heading", "Text"],
    },
    interactive: {
      title: "Actions",
      components: ["ButtonGroup"],
    },
  },
  components: {
    ButtonGroup,
    Card,
    Columns,
    Hero,
    Heading,
    Flex,
    Logos,
    Stats,
    Text,
    VerticalSpace,
  },
});

export const initialData: Record<string, UserData> = {
  "/": {
    content: [
      {
        type: "VerticalSpace",
        props: { size: "8px", id: "VerticalSpace-1687284122744" },
      },
      {
        type: "Text",
        props: {},
      },
    ],
    root: { props: { title: "Puck Example" } },
  },
};

export default conf;
