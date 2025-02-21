import { z } from "zod";

import { Avatar, AvatarPropsSchema } from "@usewaypoint/block-avatar";
import { Button, ButtonPropsSchema } from "@usewaypoint/block-button";
import { Divider, DividerPropsSchema } from "@usewaypoint/block-divider";
import { Heading, HeadingPropsSchema } from "@usewaypoint/block-heading";
import { Html, HtmlPropsSchema } from "@usewaypoint/block-html";
import { Image, ImagePropsSchema } from "@usewaypoint/block-image";
import { Spacer, SpacerPropsSchema } from "@usewaypoint/block-spacer";
import {
  buildBlockConfigurationDictionary,
  buildBlockConfigurationSchema,
} from "@usewaypoint/document-core";

import ColumnsContainerPropsSchema from "../blocks/columns-container/schema";
import ColumnsContainerReader from "../blocks/columns-container/reader";
import ConditionalContainerReader from "../blocks/conditional-container/reader";
import ConditionalContainerPropsSchema from "../blocks/conditional-container/schema";
import ContainerPropsSchema from "../blocks/container/schema";
import ContainerReader from "../blocks/container/reader";
import EmailLayoutPropsSchema from "../blocks/email-layout/schema";
import EmailLayoutReader from "../blocks/email-layout/reader";
import ForeachContainerReader from "../blocks/foreach-container/reader";
import ForeachContainerPropsSchema from "../blocks/foreach-container/schema";
import { templateProps } from "../blocks/helpers/block-wrappers/reader-block-wrapper";
import TextReader from "../blocks/text/reader";
import TextPropsSchema from "../blocks/text/schema";

export const READER_DICTIONARY = buildBlockConfigurationDictionary({
  ColumnsContainer: {
    schema: ColumnsContainerPropsSchema,
    Component: ColumnsContainerReader,
  },
  Container: {
    schema: ContainerPropsSchema,
    Component: ContainerReader,
  },
  ForeachContainer: {
    schema: ForeachContainerPropsSchema,
    Component: ForeachContainerReader,
  },
  ConditionalContainer: {
    schema: ConditionalContainerPropsSchema,
    Component: ConditionalContainerReader,
  },
  EmailLayout: {
    schema: EmailLayoutPropsSchema,
    Component: (props) => <EmailLayoutReader {...props} />,
  },
  Avatar: {
    schema: AvatarPropsSchema,
    Component: (props) => <Avatar {...templateProps(props)} />,
  },
  Button: {
    schema: ButtonPropsSchema,
    Component: (props) => <Button {...templateProps(props)} />,
  },
  Divider: {
    schema: DividerPropsSchema,
    Component: (props) => <Divider {...templateProps(props)} />,
  },
  Heading: {
    schema: HeadingPropsSchema,
    Component: (props) => <Heading {...templateProps(props)} />,
  },
  Html: {
    schema: HtmlPropsSchema,
    Component: (props) => <Html {...templateProps(props)} />,
  },
  Image: {
    schema: ImagePropsSchema,
    Component: (props) => <Image {...templateProps(props)} />,
  },
  Spacer: {
    schema: SpacerPropsSchema,
    Component: (props) => <Spacer {...templateProps(props)} />,
  },
  Text: {
    schema: TextPropsSchema,
    Component: (props) => <TextReader {...templateProps(props)} />,
  },
});

export const ReaderBlockSchema =
  buildBlockConfigurationSchema(READER_DICTIONARY);
export type TReaderBlock = z.infer<typeof ReaderBlockSchema>;

export const ReaderDocumentSchema = z.record(z.string(), ReaderBlockSchema);
export type TReaderDocument = Record<string, TReaderBlock>;
