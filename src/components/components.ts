import { Block } from "./mdx/block";
import { Grid } from "./mdx/grid";
import { MdxImage } from "./mdx/mdxImage";
import { MdxOverrides } from "./mdx/overrides";
import { Redirect } from "./mdx/redirect";
import { Booking } from "./schedule/booking";
import { Gallery } from "./sections/gallery/GallerySection";
import { PageHeroSection } from "./sections/pageHero/PageHero";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Link } from "./ui/link";

export const Components = {
  ...MdxOverrides,
  Link,
  Button,
  Grid,
  Image: MdxImage,
  Gallery,
  PageHero: PageHeroSection,
  Icon,
  Block,
  Booking,
  Redirect,
};
