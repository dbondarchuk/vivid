import { ReaderDocumentBlocksDictionary } from "@vivid/builder";
import { AccordionItem } from "./accordion-item/reader";
import { Accordion } from "./accordion/reader";
import { BookingReader } from "./booking/reader";
import { ButtonReader } from "./button/reader";
import { CarouselReader } from "./carousel/reader";
import { ConditionalContainerReader } from "./conditional-container/reader";
import { ContainerReader } from "./container/reader";
import { CustomHTML } from "./custom-html/reader";
import { ForeachContainerReader } from "./foreach-container/reader";
import { GridContainerReader } from "./grid-container/reader";
import { Heading } from "./heading/reader";
import { Icon } from "./icon/reader";
import { Image } from "./image/reader";
import { Link } from "./link/reader";
import { PageHeroReader } from "./page-hero/reader";
import { PageLayoutReader } from "./page-layout/reader";
import { PopupReader } from "./popup/reader";
import { EditorBlocksSchema } from "./schema";
import { SimpleContainerReader } from "./simple-container/reader";
import { SimpleText } from "./simple-text/reader";
import { Spacer } from "./spacer/reader";
import { TextReader } from "./text/reader";
import { Video } from "./video";
import { YouTubeVideoReader } from "./youtube-video/reader";

export const ReaderBlocks: ReaderDocumentBlocksDictionary<
  typeof EditorBlocksSchema
> = {
  Image: {
    Reader: Image,
  },
  Button: {
    Reader: ButtonReader,
  },
  Link: {
    Reader: Link,
  },
  Text: {
    Reader: TextReader,
  },
  Icon: {
    Reader: Icon,
  },
  // Divider: {
  //   Reader: Divider,
  // },
  Spacer: {
    Reader: Spacer,
  },
  PageLayout: {
    Reader: PageLayoutReader,
  },
  Heading: {
    Reader: Heading,
  },
  Container: {
    Reader: ContainerReader,
  },
  // // Columns: {
  // //   Reader: ColumnsContainerReader,
  // // },
  ConditionalContainer: {
    Reader: ConditionalContainerReader,
  },
  ForeachContainer: {
    Reader: ForeachContainerReader,
  },
  GridContainer: {
    Reader: GridContainerReader,
  },
  PageHero: {
    Reader: PageHeroReader,
  },
  Booking: {
    Reader: BookingReader,
  },
  Carousel: {
    Reader: CarouselReader,
  },
  Video: {
    Reader: Video,
  },
  Popup: {
    Reader: PopupReader,
  },
  SimpleText: {
    Reader: SimpleText,
  },
  YouTubeVideo: {
    Reader: YouTubeVideoReader,
  },
  Accordion: {
    Reader: Accordion,
  },
  AccordionItem: {
    Reader: AccordionItem,
  },
  SimpleContainer: {
    Reader: SimpleContainerReader,
  },
  CustomHTML: {
    Reader: CustomHTML,
  },
};
