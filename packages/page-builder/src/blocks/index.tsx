"use client";
import {
  EditorDocumentBlocksDictionary,
  generateId,
  TEditorBlock,
} from "@vivid/builder";
import {
  Calendar,
  ChevronDown,
  Code,
  Columns3,
  Copy,
  CopyPlus,
  Film,
  GalleryHorizontalEnd,
  Heading,
  Image,
  Images,
  Layout,
  LetterText,
  Link,
  RectangleHorizontal,
  Repeat2,
  ShieldQuestion,
  SquareMousePointer,
  SquareSquare,
  Star,
  Text,
  Zap,
} from "lucide-react";
import {
  AccordionConfiguration,
  AccordionEditor,
  AccordionPropsDefaults,
  AccordionToolbar,
} from "./accordion";
import {
  AccordionItemConfiguration,
  AccordionItemEditor,
  AccordionItemPropsDefaults,
  AccordionItemToolbar,
} from "./accordion-item";
import {
  BeforeAfterConfiguration,
  BeforeAfterEditor,
  BeforeAfterPropsDefaults,
  BeforeAfterToolbar,
} from "./before-after";
import {
  ButtonConfiguration,
  ButtonEditor,
  ButtonPropsDefaults,
  ButtonToolbar,
} from "./button";
import {
  LinkConfiguration,
  LinkEditor,
  LinkPropsDefaults,
  LinkToolbar,
} from "./link";

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
  CustomHTMLConfiguration,
  CustomHTMLEditor,
  CustomHTMLToolbar,
} from "./custom-html";
import { CustomHTMLPropsDefaults } from "./custom-html/schema";
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
  IconConfiguration,
  IconEditor,
  IconPropsDefaults,
  IconToolbar,
} from "./icon";
import {
  ImageConfiguration,
  ImageEditor,
  ImagePropsDefaults,
  ImageToolbar,
} from "./image";
import { InlineContainerConfiguration } from "./inline-container/configuration";
import { InlineContainerEditor } from "./inline-container/editor";
import { InlineContainerPropsDefaults } from "./inline-container/schema";
import { InlineContainerToolbar } from "./inline-container/toolbar";
import {
  InlineTextConfiguration,
  InlineTextEditor,
  InlineTextPropsDefaults,
  InlineTextToolbar,
} from "./inline-text";
import {
  PageHeroConfiguration,
  PageHeroEditor,
  PageHeroPropsDefaults,
  PageHeroToolbar,
} from "./page-hero";
import {
  PageLayoutConfiguration,
  PageLayoutDefaultProps,
  PageLayoutEditor,
  PageLayoutProps,
  PageLayoutToolbar,
} from "./page-layout";
import {
  PopupConfiguration,
  PopupEditor,
  PopupPropsDefaults,
  PopupToolbar,
} from "./popup";
import { EditorBlocksSchema } from "./schema";
import {
  SpacerConfiguration,
  SpacerPropsDefaults,
  SpacerToolbar,
} from "./spacer";
import { SpacerEditor } from "./spacer/editor";
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
import {
  YouTubeVideoConfiguration,
  YouTubeVideoEditor,
  YouTubeVideoPropsDefaults,
  YouTubeVideoToolbar,
} from "./youtube-video";

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
  Link: {
    displayName: "pageBuilder.blocks.link.displayName",
    icon: <Link />,
    Editor: LinkEditor,
    Configuration: LinkConfiguration,
    Toolbar: LinkToolbar,
    defaultValue: LinkPropsDefaults,
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
  Icon: {
    displayName: "pageBuilder.blocks.icon.displayName",
    icon: <Star />,
    Editor: IconEditor,
    Configuration: IconConfiguration,
    Toolbar: IconToolbar,
    defaultValue: IconPropsDefaults,
    category: "pageBuilder.blocks.categories.objects",
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
  YouTubeVideo: {
    displayName: "pageBuilder.blocks.youtubeVideo.displayName",
    icon: <Film />,
    Editor: YouTubeVideoEditor,
    Configuration: YouTubeVideoConfiguration,
    Toolbar: YouTubeVideoToolbar,
    defaultValue: YouTubeVideoPropsDefaults,
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
  InlineText: {
    displayName: "pageBuilder.blocks.inlineText.displayName",
    icon: <Text />,
    Editor: InlineTextEditor,
    Configuration: InlineTextConfiguration,
    Toolbar: InlineTextToolbar,
    defaultValue: InlineTextPropsDefaults,
    category: "pageBuilder.blocks.categories.text",
  },
  Accordion: {
    displayName: "pageBuilder.blocks.accordion.displayName",
    icon: <ChevronDown />,
    Editor: AccordionEditor,
    Configuration: AccordionConfiguration,
    Toolbar: AccordionToolbar,
    defaultValue: AccordionPropsDefaults,
    category: "pageBuilder.blocks.categories.layout",
  },
  AccordionItem: {
    displayName: "pageBuilder.blocks.accordionItem.displayName",
    icon: <ChevronDown />,
    Editor: AccordionItemEditor,
    Configuration: AccordionItemConfiguration,
    Toolbar: AccordionItemToolbar,
    defaultValue: AccordionItemPropsDefaults,
    category: "pageBuilder.blocks.categories.layout",
    allowedIn: ["Accordion"],
  },
  InlineContainer: {
    displayName: "pageBuilder.blocks.inlineContainer.displayName",
    icon: <Copy />,
    Editor: InlineContainerEditor,
    Configuration: InlineContainerConfiguration,
    Toolbar: InlineContainerToolbar,
    defaultValue: InlineContainerPropsDefaults,
    category: "pageBuilder.blocks.categories.layout",
  },
  CustomHTML: {
    displayName: "pageBuilder.blocks.customHtml.displayName",
    icon: <Code />,
    Editor: CustomHTMLEditor,
    Configuration: CustomHTMLConfiguration,
    Toolbar: CustomHTMLToolbar,
    defaultValue: CustomHTMLPropsDefaults,
    category: "pageBuilder.blocks.categories.layout",
  },
  BeforeAfter: {
    displayName: "pageBuilder.blocks.beforeAfterSlider.displayName",
    icon: <Images />,
    Editor: BeforeAfterEditor,
    Configuration: BeforeAfterConfiguration,
    Toolbar: BeforeAfterToolbar,
    defaultValue: BeforeAfterPropsDefaults,
    category: "pageBuilder.blocks.categories.objects",
  },
};

export const RootBlock: TEditorBlock<Partial<PageLayoutProps>> = {
  data: PageLayoutDefaultProps,
  id: generateId(),
  type: "PageLayout",
};
