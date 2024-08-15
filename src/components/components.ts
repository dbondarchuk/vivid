import { Block } from "./web/mdx/block";
import { Grid } from "./web/mdx/grid";
import { MdxImage } from "./web/mdx/mdxImage";
import { MdxOverrides } from "./web/mdx/overrides";
import { Redirect } from "./web/mdx/redirect";
import { Booking } from "./web/schedule/booking";
import { Gallery } from "./web/gallery/Gallery";
import { PageHero } from "./web/pageHero/PageHero";
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
  PageHero,
  Icon,
  Block,
  Booking,
  Redirect,
};
