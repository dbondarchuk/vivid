import { z } from "zod";

import { Avatar, AvatarPropsSchema } from "@usewaypoint/block-avatar";
import { ButtonPropsSchema } from "@usewaypoint/block-button";
import { Divider, DividerPropsSchema } from "@usewaypoint/block-divider";
import { HeadingPropsSchema } from "@usewaypoint/block-heading";
import { Html, HtmlPropsSchema } from "@usewaypoint/block-html";
import { Image, ImagePropsSchema } from "@usewaypoint/block-image";
import { Spacer, SpacerPropsSchema } from "@usewaypoint/block-spacer";
import {
  buildBlockComponent,
  buildBlockConfigurationDictionary,
  buildBlockConfigurationSchema,
} from "@usewaypoint/document-core";

import { ButtonEditor } from "../blocks/button/editor";
import ColumnsContainerEditor from "../blocks/columns-container/editor";
import ColumnsContainerPropsSchema from "../blocks/columns-container/schema";
import ConditionalContainerEditor from "../blocks/conditional-container/editor";
import ConditionalContainerPropsSchema from "../blocks/conditional-container/schema";
import ContainerEditor from "../blocks/container/editor";
import ContainerPropsSchema from "../blocks/container/schema";
import EmailLayoutEditor from "../blocks/email-layout/editor";
import EmailLayoutPropsSchema from "../blocks/email-layout/schema";
import ForeachContainerEditor from "../blocks/foreach-container/editor";
import ForeachContainerPropsSchema from "../blocks/foreach-container/schema";
import { HeadingEditor } from "../blocks/heading/editor";
import EditorBlockWrapper from "../blocks/helpers/block-wrappers/editor-block-wrapper";
import { templateProps } from "../blocks/helpers/block-wrappers/utils";
import { TextEditor } from "../blocks/text/editor";
import TextPropsSchema from "../blocks/text/schema";
import { useEditorArgs } from "./context";

const templatePropsFromContext = (props: any) => {
  const args = useEditorArgs();
  return templateProps(props, args);
};

const EDITOR_DICTIONARY = buildBlockConfigurationDictionary({
  Avatar: {
    schema: AvatarPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Avatar {...templatePropsFromContext(props)} />
      </EditorBlockWrapper>
    ),
  },
  Button: {
    schema: ButtonPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <ButtonEditor {...props} />
      </EditorBlockWrapper>
    ),
  },
  Container: {
    schema: ContainerPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <ContainerEditor {...props} />
      </EditorBlockWrapper>
    ),
  },
  ForeachContainer: {
    schema: ForeachContainerPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <ForeachContainerEditor {...props} />
      </EditorBlockWrapper>
    ),
  },
  ConditionalContainer: {
    schema: ConditionalContainerPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <ConditionalContainerEditor {...props} />
      </EditorBlockWrapper>
    ),
  },
  ColumnsContainer: {
    schema: ColumnsContainerPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <ColumnsContainerEditor {...props} />
      </EditorBlockWrapper>
    ),
  },
  Heading: {
    schema: HeadingPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <HeadingEditor {...props} />
      </EditorBlockWrapper>
    ),
  },
  Html: {
    schema: HtmlPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Html {...props} />
      </EditorBlockWrapper>
    ),
  },
  Image: {
    schema: ImagePropsSchema,
    Component: (data) => {
      const props = {
        ...data,
        props: {
          ...data.props,
          url:
            data.props?.url ??
            "https://placehold.co/600x400@2x/F8F8F8/CCC?text=Your%20image",
        },
      };
      return (
        <EditorBlockWrapper>
          <Image {...templatePropsFromContext(props)} />
        </EditorBlockWrapper>
      );
    },
  },
  Text: {
    schema: TextPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <TextEditor {...props} />
      </EditorBlockWrapper>
    ),
  },
  EmailLayout: {
    schema: EmailLayoutPropsSchema,
    Component: (p) => <EmailLayoutEditor {...p} />,
  },
  Spacer: {
    schema: SpacerPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Spacer {...props} />
      </EditorBlockWrapper>
    ),
  },
  Divider: {
    schema: DividerPropsSchema,
    Component: (props) => (
      <EditorBlockWrapper>
        <Divider {...props} />
      </EditorBlockWrapper>
    ),
  },
});

export const EditorBlock = buildBlockComponent(EDITOR_DICTIONARY);
export const EditorBlockSchema =
  buildBlockConfigurationSchema(EDITOR_DICTIONARY);
export const EditorConfigurationSchema = z.record(
  z.string(),
  EditorBlockSchema
);

export type TEditorBlock = z.infer<typeof EditorBlockSchema>;
export type TEditorConfiguration = Record<string, TEditorBlock>;
