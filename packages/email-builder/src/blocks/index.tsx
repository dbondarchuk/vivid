import {
  EditorDocumentBlocksDictionary,
  generateId,
  TEditorBlock,
} from "@vivid/builder";
import {
  CircleUserRound,
  Code,
  Columns3,
  CopyPlus,
  Heading,
  Image,
  Layout,
  RectangleHorizontal,
  Repeat2,
  ShieldQuestion,
  SquareMousePointer,
  SquareSplitVertical,
  Text,
} from "lucide-react";
import {
  AvatarConfiguration,
  AvatarEditor,
  AvatarPropsDefaults,
  AvatarToolbar,
} from "./avatar";
import {
  ButtonConfiguration,
  ButtonEditor,
  ButtonPropsDefaults,
  ButtonToolbar,
} from "./button";
import {
  ColumnsContainerConfiguration,
  ColumnsContainerPropsDefaults,
  ColumnsContainerToolbar,
} from "./columns-container";
import ColumnsContainerEditor from "./columns-container/editor";
import {
  ConditionalContainerConfiguration,
  ConditionalContainerEditor,
  ConditionalContainerPropsDefaults,
} from "./conditional-container";
import {
  ContainerConfiguration,
  ContainerEditor,
  ContainerPropsDefaults,
  ContainerToolbar,
} from "./container";
import {
  CustomHTMLConfiguration,
  CustomHTMLEditor,
  CustomHTMLPropsDefaults,
  CustomHTMLToolbar,
} from "./custom-html";
import {
  Divider,
  DividerConfiguration,
  DividerPropsDefaults,
  DividerToolbar,
} from "./divider";
import {
  EmailLayoutConfiguration,
  EmailLayoutEditor,
  EmailLayoutToolbar,
} from "./email-layout";
import {
  EmailLayoutDefaultProps,
  EmailLayoutProps,
} from "./email-layout/schema";
import {
  ForeachContainerConfiguration,
  ForeachContainerEditor,
  ForeachContainerPropsDefaults,
} from "./foreach-container";
import {
  HeadingConfiguration,
  HeadingEditor,
  HeadingPropsDefaults,
  HeadingToolbar,
} from "./heading";
import {
  ImageConfiguration,
  ImageEditor,
  ImagePropsDefaults,
  ImageToolbar,
} from "./image";
import { EditorBlocksSchema } from "./schema";
import {
  Spacer,
  SpacerConfiguration,
  SpacerPropsDefaults,
  SpacerToolbar,
} from "./spacer";
import { TextConfiguration, TextEditor, TextToolbar } from "./text";
import { TextPropsDefaults } from "./text/schema";

export const EditorBlocks: EditorDocumentBlocksDictionary<
  typeof EditorBlocksSchema
> = {
  Avatar: {
    displayName: "emailBuilder.blocks.avatar.displayName",
    icon: <CircleUserRound />,
    Editor: AvatarEditor,
    Configuration: AvatarConfiguration,
    Toolbar: AvatarToolbar,
    defaultValue: AvatarPropsDefaults,
    category: "emailBuilder.blocks.categories.images",
  },
  Image: {
    displayName: "emailBuilder.blocks.image.displayName",
    icon: <Image />,
    Editor: ImageEditor,
    Configuration: ImageConfiguration,
    Toolbar: ImageToolbar,
    defaultValue: ImagePropsDefaults,
    category: "emailBuilder.blocks.categories.images",
  },
  Button: {
    displayName: "emailBuilder.blocks.button.displayName",
    icon: <SquareMousePointer />,
    Editor: ButtonEditor,
    Configuration: ButtonConfiguration,
    Toolbar: ButtonToolbar,
    defaultValue: ButtonPropsDefaults,
    category: "emailBuilder.blocks.categories.text",
  },
  Heading: {
    displayName: "emailBuilder.blocks.heading.displayName",
    icon: <Heading />,
    Configuration: HeadingConfiguration,
    Editor: HeadingEditor,
    Toolbar: HeadingToolbar,
    defaultValue: HeadingPropsDefaults,
    category: "emailBuilder.blocks.categories.text",
  },
  Text: {
    displayName: "emailBuilder.blocks.text.displayName",
    icon: <Text />,
    Editor: TextEditor,
    Configuration: TextConfiguration,
    Toolbar: TextToolbar,
    defaultValue: TextPropsDefaults,
    category: "emailBuilder.blocks.categories.text",
  },
  Divider: {
    displayName: "emailBuilder.blocks.divider.displayName",
    icon: <SquareSplitVertical />,
    Editor: Divider,
    Configuration: DividerConfiguration,
    Toolbar: DividerToolbar,
    defaultValue: DividerPropsDefaults,
    category: "emailBuilder.blocks.categories.dividers",
  },
  Spacer: {
    displayName: "emailBuilder.blocks.spacer.displayName",
    icon: <RectangleHorizontal />,
    Editor: Spacer,
    Configuration: SpacerConfiguration,
    Toolbar: SpacerToolbar,
    defaultValue: SpacerPropsDefaults,
    category: "emailBuilder.blocks.categories.dividers",
  },
  EmailLayout: {
    displayName: "emailBuilder.blocks.emailLayout.displayName",
    icon: <Layout />,
    Editor: EmailLayoutEditor,
    Configuration: EmailLayoutConfiguration,
    Toolbar: EmailLayoutToolbar,
    defaultValue: EmailLayoutDefaultProps,
    category: "emailBuilder.blocks.categories.layout",
  },
  Container: {
    displayName: "emailBuilder.blocks.container.displayName",
    icon: <CopyPlus />,
    Configuration: ContainerConfiguration,
    Editor: ContainerEditor,
    Toolbar: ContainerToolbar,
    defaultValue: ContainerPropsDefaults,
    category: "emailBuilder.blocks.categories.containers",
  },
  Columns: {
    displayName: "emailBuilder.blocks.columnsContainer.displayName",
    icon: <Columns3 />,
    Configuration: ColumnsContainerConfiguration,
    Editor: ColumnsContainerEditor,
    Toolbar: ColumnsContainerToolbar,
    defaultValue: ColumnsContainerPropsDefaults,
    category: "emailBuilder.blocks.categories.containers",
  },
  ConditionalContainer: {
    displayName: "emailBuilder.blocks.conditionalContainer.displayName",
    icon: <ShieldQuestion />,
    Configuration: ConditionalContainerConfiguration,
    Editor: ConditionalContainerEditor,
    defaultValue: ConditionalContainerPropsDefaults,
    category: "emailBuilder.blocks.categories.containers",
  },
  ForeachContainer: {
    displayName: "emailBuilder.blocks.foreachContainer.displayName",
    icon: <Repeat2 />,
    Configuration: ForeachContainerConfiguration,
    Editor: ForeachContainerEditor,
    defaultValue: ForeachContainerPropsDefaults,
    category: "emailBuilder.blocks.categories.containers",
  },
  CustomHTML: {
    displayName: "emailBuilder.blocks.customHtml.displayName",
    icon: <Code />,
    Editor: CustomHTMLEditor,
    Configuration: CustomHTMLConfiguration,
    Toolbar: CustomHTMLToolbar,
    defaultValue: CustomHTMLPropsDefaults,
    category: "emailBuilder.blocks.categories.layout",
  },
};

export const RootBlock: TEditorBlock<Partial<EmailLayoutProps>> = {
  data: EmailLayoutDefaultProps,
  id: generateId(),
  type: "EmailLayout",
};
