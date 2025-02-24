import { z } from "zod";

import { Avatar, AvatarPropsSchema } from "@usewaypoint/block-avatar";
import { Button, ButtonPropsSchema } from "@usewaypoint/block-button";
import { Divider, DividerPropsSchema } from "@usewaypoint/block-divider";
import { Heading, HeadingPropsSchema } from "@usewaypoint/block-heading";
import { Html, HtmlPropsSchema } from "@usewaypoint/block-html";
import { Image, ImagePropsSchema } from "@usewaypoint/block-image";
import { Spacer, SpacerPropsSchema } from "@usewaypoint/block-spacer";

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
import { templateProps } from "../blocks/helpers/block-wrappers/utils";
import TextReader from "../blocks/text/reader";
import TextPropsSchema from "../blocks/text/schema";
import { JSX } from "react";
import { BlockConfiguration } from "@usewaypoint/document-core";

export type BaseZodDictionary = { [name: string]: z.AnyZodObject };
export type DocumentBlocksDictionary<T extends BaseZodDictionary> = {
  [K in keyof T]: {
    schema: T[K];
    Component: (props: z.infer<T[K]> & BaseReaderBlockProps) => JSX.Element;
  };
};

function buildBlockConfigurationDictionary<T extends BaseZodDictionary>(
  blocks: DocumentBlocksDictionary<T>
) {
  return blocks;
}

function buildBlockConfigurationSchema<T extends BaseZodDictionary>(
  blocks: DocumentBlocksDictionary<T>
) {
  const blockObjects = Object.keys(blocks).map((type: keyof T) =>
    z.object({
      type: z.literal(type),
      data: blocks[type].schema.merge(
        z.object({
          document: z.any(),
          args: z.record(z.string(), z.any()),
        })
      ),
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return z
    .discriminatedUnion("type", blockObjects as any)
    .transform((v) => v as BlockConfiguration<T>);
}

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
    Component: ({ args, document: _, ...props }) => (
      <Avatar {...templateProps(props, args)} />
    ),
  },
  Button: {
    schema: ButtonPropsSchema,
    Component: ({ args, document: _, ...props }) => (
      <Button {...templateProps(props, args)} />
    ),
  },
  Divider: {
    schema: DividerPropsSchema,
    Component: ({ args, document: _, ...props }) => (
      <Divider {...templateProps(props, args)} />
    ),
  },
  Heading: {
    schema: HeadingPropsSchema,
    Component: ({ args, document: _, ...props }) => (
      <Heading {...templateProps(props, args)} />
    ),
  },
  Html: {
    schema: HtmlPropsSchema,
    Component: ({ args, document: _, ...props }) => (
      <Html {...templateProps(props, args)} />
    ),
  },
  Image: {
    schema: ImagePropsSchema,
    Component: ({ args, document: _, ...props }) => (
      <Image {...templateProps(props, args)} />
    ),
  },
  Spacer: {
    schema: SpacerPropsSchema,
    Component: ({ args, document: _, ...props }) => (
      <Spacer {...templateProps(props, args)} />
    ),
  },
  Text: {
    schema: TextPropsSchema,
    Component: ({ args, document: _, ...props }) => (
      <TextReader {...templateProps(props, args)} />
    ),
  },
});

export const ReaderBlockSchema =
  buildBlockConfigurationSchema(READER_DICTIONARY);
export type TReaderBlock = z.infer<typeof ReaderBlockSchema>;

export const ReaderDocumentSchema = z.record(z.string(), ReaderBlockSchema);
export type TReaderDocument = Record<string, TReaderBlock>;

export type BaseReaderBlockProps = {
  document: any; // TReaderDocument
  args: Record<string, any>;
};
