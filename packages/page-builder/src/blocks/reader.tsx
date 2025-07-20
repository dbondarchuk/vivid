import { ReaderDocumentBlocksDictionary } from "@vivid/builder";
import { Accordion } from "./accordion/reader";
import { AccordionItem } from "./accordion-item/reader";
import { BookingReader } from "./booking/reader";
import { Button } from "./button/reader";
import { CarouselReader } from "./carousel/reader";
import { ConditionalContainerReader } from "./conditional-container/reader";
import { ContainerReader } from "./container/reader";
import { ForeachContainerReader } from "./foreach-container/reader";
import { GridContainerReader } from "./grid-container/reader";
import { Heading } from "./heading/reader";
import { Image } from "./image/reader";
import { PageHeroReader } from "./page-hero/reader";
import { PageLayoutReader } from "./page-layout/reader";
import { PopupReader } from "./popup/reader";
import { EditorBlocksSchema } from "./schema";
import { Spacer } from "./spacer/reader";
import { TextReader } from "./text/reader";
import { Video } from "./video";
import { SimpleText } from "./simple-text/reader";
import { YouTubeVideoReader } from "./youtube-video/reader";

export const ReaderBlocks: ReaderDocumentBlocksDictionary<
  typeof EditorBlocksSchema
> = {
  Image: {
    Reader: Image,
  },
  Button: {
    Reader: Button,
  },
  Text: {
    Reader: TextReader,
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
};
