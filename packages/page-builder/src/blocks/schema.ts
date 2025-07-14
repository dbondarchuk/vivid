import { BookingPropsSchema } from "./booking/schema";
import { ButtonPropsSchema } from "./button/schema";
import { CarouselPropsSchema } from "./carousel/schema";
import { ConditionalContainerPropsSchema } from "./conditional-container/schema";
import { ContainerPropsSchema } from "./container/schema";
import { ForeachContainerPropsSchema } from "./foreach-container/schema";
import { GridContainerPropsSchema } from "./grid-container/schema";
import { HeadingPropsSchema } from "./heading/schema";
import { ImagePropsSchema } from "./image/schema";
import { PageHeroPropsSchema } from "./page-hero/schema";
import { PageLayoutPropsSchema } from "./page-layout/schema";
import { SpacerPropsSchema } from "./spacer/schema";
import { TextPropsSchema } from "./text/schema";

export const EditorBlocksSchema = {
  Image: ImagePropsSchema,
  Button: ButtonPropsSchema,
  Heading: HeadingPropsSchema,
  Text: TextPropsSchema,
  Spacer: SpacerPropsSchema,
  PageLayout: PageLayoutPropsSchema,
  Container: ContainerPropsSchema,
  GridContainer: GridContainerPropsSchema,
  PageHero: PageHeroPropsSchema,
  // // Columns: ColumnsContainerPropsSchema,
  ConditionalContainer: ConditionalContainerPropsSchema,
  ForeachContainer: ForeachContainerPropsSchema,
  Booking: BookingPropsSchema,
  Carousel: CarouselPropsSchema,
} as {
  Image: typeof ImagePropsSchema;
  Button: typeof ButtonPropsSchema;
  Heading: typeof HeadingPropsSchema;
  Text: typeof TextPropsSchema;
  Spacer: typeof SpacerPropsSchema;
  PageLayout: typeof PageLayoutPropsSchema;
  Container: typeof ContainerPropsSchema;
  GridContainer: typeof GridContainerPropsSchema;
  PageHero: typeof PageHeroPropsSchema;
  ConditionalContainer: typeof ConditionalContainerPropsSchema;
  ForeachContainer: typeof ForeachContainerPropsSchema;
  Booking: typeof BookingPropsSchema;
  Carousel: typeof CarouselPropsSchema;
};
