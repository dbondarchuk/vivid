import {
  EditorDocumentBlocksDictionary,
  generateId,
  TEditorBlock,
} from "@vivid/builder";
import {
  Calendar,
  Columns3,
  CopyPlus,
  Film,
  GalleryHorizontalEnd,
  Heading,
  Image,
  Layout,
  LetterText,
  RectangleHorizontal,
  Repeat2,
  ShieldQuestion,
  SquareMousePointer,
  SquareSquare,
  Text,
  Zap,
} from "lucide-react";
import {
  ButtonConfiguration,
  ButtonEditor,
  ButtonPropsDefaults,
  ButtonToolbar,
} from "./button";

import {
  BookingConfiguration,
  BookingEditor,
  BookingPropsDefaults,
  BookingToolbar,
} from "./booking";
import {
  CarouselConfiguration,
  CarouselEditor,
  CarouselPropsDefaults,
  CarouselToolbar,
} from "./carousel";
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
  ForeachContainerConfiguration,
  ForeachContainerEditor,
  ForeachContainerPropsDefaults,
} from "./foreach-container";
import {
  GridContainerConfiguration,
  GridContainerEditor,
  GridContainerPropsDefaults,
  GridContainerToolbar,
} from "./grid-container";
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
import {
  PageHeroConfiguration,
  PageHeroEditor,
  PageHeroPropsDefaults,
  PageHeroToolbar,
} from "./page-hero";
import {
  PageLayoutConfiguration,
  PageLayoutEditor,
  PageLayoutDefaultProps,
  PageLayoutProps,
  PageLayoutToolbar,
} from "./page-layout";
import {
  PopupConfiguration,
  PopupEditor,
  PopupPropsDefaults,
  PopupToolbar,
} from "./popup";
import {
  SimpleTextConfiguration,
  SimpleTextEditor,
  SimpleTextPropsDefaults,
  SimpleTextToolbar,
} from "./simple-text";
import { EditorBlocksSchema } from "./schema";
import {
  Spacer,
  SpacerConfiguration,
  SpacerPropsDefaults,
  SpacerToolbar,
} from "./spacer";
import {
  TextConfiguration,
  TextEditor,
  TextPropsDefaults,
  TextToolbar,
} from "./text";
import {
  VideoConfiguration,
  VideoEditor,
  VideoPropsDefaults,
  VideoToolbar,
} from "./video";
import { SpacerEditor } from "./spacer/editor";

export const EditorBlocks: EditorDocumentBlocksDictionary<
  typeof EditorBlocksSchema
> = {
  Image: {
    displayName: "pageBuilder.blocks.image.displayName",
    icon: <Image />,
    Editor: ImageEditor,
    Configuration: ImageConfiguration,
    Toolbar: ImageToolbar,
    defaultValue: ImagePropsDefaults,
    category: "pageBuilder.blocks.categories.objects",
  },
  Button: {
    displayName: "pageBuilder.blocks.button.displayName",
    icon: <SquareMousePointer />,
    Editor: ButtonEditor,
    Configuration: ButtonConfiguration,
    Toolbar: ButtonToolbar,
    defaultValue: ButtonPropsDefaults,
    category: "pageBuilder.blocks.categories.buttons",
  },
  Heading: {
    displayName: "pageBuilder.blocks.heading.displayName",
    icon: <Heading />,
    Configuration: HeadingConfiguration,
    Editor: HeadingEditor,
    Toolbar: HeadingToolbar,
    defaultValue: HeadingPropsDefaults,
    category: "pageBuilder.blocks.categories.text",
  },
  Text: {
    displayName: "pageBuilder.blocks.text.displayName",
    icon: <LetterText />,
    Editor: TextEditor,
    Configuration: TextConfiguration,
    Toolbar: TextToolbar,
    defaultValue: TextPropsDefaults,
    category: "pageBuilder.blocks.categories.text",
  },
  // Divider: {
  //   displayName: "Divider",
  //   icon: <SquareSplitVertical />,
  //   Editor: Divider,
  //   Configuration: DividerConfiguration,
  //   Toolbar: DividerToolbar,
  //   defaultValue: DividerPropsDefaults,
  //   category: "Dividers",
  // },
  Spacer: {
    displayName: "pageBuilder.blocks.spacer.displayName",
    icon: <RectangleHorizontal />,
    Editor: SpacerEditor,
    Configuration: SpacerConfiguration,
    Toolbar: SpacerToolbar,
    defaultValue: SpacerPropsDefaults,
    category: "pageBuilder.blocks.categories.layout",
  },
  PageLayout: {
    displayName: "pageBuilder.blocks.pageLayout.displayName",
    icon: <Layout />,
    Editor: PageLayoutEditor,
    Configuration: PageLayoutConfiguration,
    Toolbar: PageLayoutToolbar,
    defaultValue: PageLayoutDefaultProps,
    category: "pageBuilder.blocks.categories.layout",
  },
  Container: {
    displayName: "pageBuilder.blocks.container.displayName",
    icon: <CopyPlus />,
    Configuration: ContainerConfiguration,
    Editor: ContainerEditor,
    Toolbar: ContainerToolbar,
    defaultValue: ContainerPropsDefaults,
    category: "pageBuilder.blocks.categories.layout",
  },
  GridContainer: {
    displayName: "pageBuilder.blocks.gridContainer.displayName",
    icon: <Columns3 />,
    Configuration: GridContainerConfiguration,
    Editor: GridContainerEditor,
    Toolbar: GridContainerToolbar,
    defaultValue: GridContainerPropsDefaults,
    category: "pageBuilder.blocks.categories.layout",
  },
  PageHero: {
    displayName: "pageBuilder.blocks.pageHero.displayName",
    icon: <Zap />,
    Configuration: PageHeroConfiguration,
    Editor: PageHeroEditor,
    Toolbar: PageHeroToolbar,
    defaultValue: PageHeroPropsDefaults,
    category: "pageBuilder.blocks.categories.layout",
  },
  // Columns: {
  //   displayName: "Columns",
  //   icon: <Columns3 />,
  //   Configuration: ColumnsContainerConfiguration,
  //   Editor: ColumnsContainerEditor,
  //   Toolbar: ColumnsContainerToolbar,
  //   defaultValue: ColumnsContainerPropsDefaults,
  //   category: "Containers",
  // },
  ConditionalContainer: {
    displayName: "pageBuilder.blocks.conditionalContainer.displayName",
    icon: <ShieldQuestion />,
    Configuration: ConditionalContainerConfiguration,
    Editor: ConditionalContainerEditor,
    defaultValue: ConditionalContainerPropsDefaults,
    category: "pageBuilder.blocks.categories.layout",
  },
  ForeachContainer: {
    displayName: "pageBuilder.blocks.foreachContainer.displayName",
    icon: <Repeat2 />,
    Configuration: ForeachContainerConfiguration,
    Editor: ForeachContainerEditor,
    defaultValue: ForeachContainerPropsDefaults,
    category: "pageBuilder.blocks.categories.layout",
  },
  Booking: {
    displayName: "pageBuilder.blocks.booking.displayName",
    icon: <Calendar />,
    Configuration: BookingConfiguration,
    Editor: BookingEditor,
    Toolbar: BookingToolbar,
    defaultValue: BookingPropsDefaults,
    category: "pageBuilder.blocks.categories.booking",
  },
  Carousel: {
    displayName: "pageBuilder.blocks.carousel.displayName",
    icon: <GalleryHorizontalEnd />,
    Editor: CarouselEditor,
    Configuration: CarouselConfiguration,
    Toolbar: CarouselToolbar,
    defaultValue: CarouselPropsDefaults,
    category: "pageBuilder.blocks.categories.layout",
  },
  Video: {
    displayName: "pageBuilder.blocks.video.displayName",
    icon: <Film />,
    Editor: VideoEditor,
    Configuration: VideoConfiguration,
    Toolbar: VideoToolbar,
    defaultValue: VideoPropsDefaults,
    category: "pageBuilder.blocks.categories.objects",
  },
  Popup: {
    displayName: "pageBuilder.blocks.popup.displayName",
    icon: <SquareSquare />,
    Editor: PopupEditor,
    Configuration: PopupConfiguration,
    Toolbar: PopupToolbar,
    defaultValue: PopupPropsDefaults,
    category: "pageBuilder.blocks.categories.objects",
    allowedIn: ["PageLayout"],
  },
  SimpleText: {
    displayName: "pageBuilder.blocks.simpleText.displayName",
    icon: <Text />,
    Editor: SimpleTextEditor,
    Configuration: SimpleTextConfiguration,
    Toolbar: SimpleTextToolbar,
    defaultValue: SimpleTextPropsDefaults,
    category: "pageBuilder.blocks.categories.text",
  },
};

export const RootBlock: TEditorBlock<Partial<PageLayoutProps>> = {
  data: PageLayoutDefaultProps,
  id: generateId(),
  type: "PageLayout",
};
