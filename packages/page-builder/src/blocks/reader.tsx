import { ReaderDocumentBlocksDictionary } from "@vivid/builder";
import { Button } from "./button/reader";
import { ConditionalContainerReader } from "./conditional-container/reader";
import { ContainerReader } from "./container/reader";
import { ForeachContainerReader } from "./foreach-container/reader";
import { GridContainerReader } from "./grid-container/reader";
import { PageLayoutReader } from "./page-layout/reader";
import { Heading } from "./heading/reader";
import { Image } from "./image/reader";
import { EditorBlocksSchema } from "./schema";
import { Spacer } from "./spacer/reader";
import { TextReader } from "./text/reader";
import { PageHeroReader } from "./page-hero/reader";
import { BookingReader } from "./booking/reader";
import { CarouselReader } from "./carousel/reader";

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
};
