import {
  EditorDocumentBlocksDictionary,
  generateId,
  TEditorBlock,
} from "@vivid/builder";
import {
  CircleUserRound,
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
    displayName: "Avatar",
    icon: <CircleUserRound />,
    Editor: AvatarEditor,
    Configuration: AvatarConfiguration,
    Toolbar: AvatarToolbar,
    defaultValue: AvatarPropsDefaults,
    category: "Images",
  },
  Image: {
    displayName: "Image",
    icon: <Image />,
    Editor: ImageEditor,
    Configuration: ImageConfiguration,
    Toolbar: ImageToolbar,
    defaultValue: ImagePropsDefaults,
    category: "Images",
  },
  Button: {
    displayName: "Button",
    icon: <SquareMousePointer />,
    Editor: ButtonEditor,
    Configuration: ButtonConfiguration,
    Toolbar: ButtonToolbar,
    defaultValue: ButtonPropsDefaults,
    category: "Text",
  },
  Heading: {
    displayName: "Heading",
    icon: <Heading />,
    Configuration: HeadingConfiguration,
    Editor: HeadingEditor,
    Toolbar: HeadingToolbar,
    defaultValue: HeadingPropsDefaults,
    category: "Text",
  },
  Text: {
    displayName: "Text",
    icon: <Text />,
    Editor: TextEditor,
    Configuration: TextConfiguration,
    Toolbar: TextToolbar,
    defaultValue: TextPropsDefaults,
    category: "Text",
  },
  Divider: {
    displayName: "Divider",
    icon: <SquareSplitVertical />,
    Editor: Divider,
    Configuration: DividerConfiguration,
    Toolbar: DividerToolbar,
    defaultValue: DividerPropsDefaults,
    category: "Dividers",
  },
  Spacer: {
    displayName: "Spacer",
    icon: <RectangleHorizontal />,
    Editor: Spacer,
    Configuration: SpacerConfiguration,
    Toolbar: SpacerToolbar,
    defaultValue: SpacerPropsDefaults,
    category: "Dividers",
  },
  EmailLayout: {
    displayName: "Layout",
    icon: <Layout />,
    Editor: EmailLayoutEditor,
    Configuration: EmailLayoutConfiguration,
    Toolbar: EmailLayoutToolbar,
    defaultValue: EmailLayoutDefaultProps,
    category: "Layout",
  },
  Container: {
    displayName: "Container",
    icon: <CopyPlus />,
    Configuration: ContainerConfiguration,
    Editor: ContainerEditor,
    Toolbar: ContainerToolbar,
    defaultValue: ContainerPropsDefaults,
    category: "Containers",
  },
  Columns: {
    displayName: "Columns",
    icon: <Columns3 />,
    Configuration: ColumnsContainerConfiguration,
    Editor: ColumnsContainerEditor,
    Toolbar: ColumnsContainerToolbar,
    defaultValue: ColumnsContainerPropsDefaults,
    category: "Containers",
  },
  ConditionalContainer: {
    displayName: "Conditional Container",
    icon: <ShieldQuestion />,
    Configuration: ConditionalContainerConfiguration,
    Editor: ConditionalContainerEditor,
    defaultValue: ConditionalContainerPropsDefaults,
    category: "Containers",
  },
  ForeachContainer: {
    displayName: "Loop Container",
    icon: <Repeat2 />,
    Configuration: ForeachContainerConfiguration,
    Editor: ForeachContainerEditor,
    defaultValue: ForeachContainerPropsDefaults,
    category: "Containers",
  },
};

export const RootBlock: TEditorBlock<Partial<EmailLayoutProps>> = {
  data: EmailLayoutDefaultProps,
  id: generateId(),
  type: "EmailLayout",
};
