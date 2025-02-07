import { Button, Icon, Link } from "@vivid/ui";
import { Gallery } from "./web/gallery";
import { Block } from "./web/mdx/block";
import { Container } from "./web/mdx/container";
import { Grid } from "./web/mdx/grid";
import { MdxImage } from "./web/mdx/mdxImage";
import { MdxOverrides } from "./web/mdx/overrides";
import { PageHero } from "./web/pageHero";

export const ClientComponents = {
  ...MdxOverrides,
  Link,
  Button,
  Grid,
  Image: MdxImage,
  Gallery,
  PageHero,
  Icon,
  Block,
  Container,
};
