import { Button, Icon, Link } from "@vivid/ui";
import { Gallery } from "./web/gallery";
import { Block } from "./web/mdx/block";
import { Container } from "./web/mdx/container";
import { Grid } from "./web/mdx/grid";
import { MdxImage } from "./web/mdx/mdx-image";
import { MdxOverrides } from "./web/mdx/overrides";
import { Popup } from "./web/mdx/popup";
import { PageHero } from "./web/page-hero";

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
  Popup,
};
