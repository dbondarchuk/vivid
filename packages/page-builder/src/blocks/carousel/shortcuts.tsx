import { AlignHorizontalJustifyCenter, GalleryHorizontal } from "lucide-react";
import { Shortcut } from "../../shortcuts";
import { colorShortcut } from "../../shortcuts/common/color";
import { fontFamilyShortcut } from "../../shortcuts/common/font-family";
import { CarouselStylesSchema } from "./schema";

export const carouselShortcuts: Shortcut<CarouselStylesSchema>[] = [
  {
    label: "pageBuilder.blocks.carousel.shortcuts.itemsPerSlide.label",
    icon: ({ className }: { className?: string }) => (
      <GalleryHorizontal className={className} />
    ),
    options: [
      {
        label: "pageBuilder.blocks.carousel.shortcuts.itemsPerSlide.mobile",
        value: "mobile",
        targetStyles: {
          carouselChildrenItemsPerSlide: {
            variants: [
              { value: 1, breakpoint: [] },
              { value: 2, breakpoint: ["md"] },
              { value: 3, breakpoint: ["lg"] },
              { value: 4, breakpoint: ["xl"] },
            ],
          },
        },
      },
      {
        label: "pageBuilder.blocks.carousel.shortcuts.itemsPerSlide.tablet",
        value: "tablet",
        targetStyles: {
          carouselChildrenItemsPerSlide: {
            variants: [
              { value: 1, breakpoint: [] },
              { value: 2, breakpoint: ["sm"] },
              { value: 3, breakpoint: ["md"] },
              { value: 4, breakpoint: ["lg"] },
              { value: 5, breakpoint: ["xl"] },
            ],
          },
        },
      },
      {
        label: "pageBuilder.blocks.carousel.shortcuts.itemsPerSlide.desktop",
        value: "desktop",
        targetStyles: {
          carouselChildrenItemsPerSlide: {
            variants: [
              { value: 2, breakpoint: [] },
              { value: 3, breakpoint: ["md"] },
              { value: 4, breakpoint: ["lg"] },
              { value: 5, breakpoint: ["xl"] },
            ],
          },
        },
      },
    ],
  },
  {
    label: "pageBuilder.blocks.carousel.shortcuts.childrenPosition.label",
    icon: ({ className }: { className?: string }) => (
      <AlignHorizontalJustifyCenter className={className} />
    ),
    options: [
      {
        label: "pageBuilder.blocks.carousel.shortcuts.childrenPosition.start",
        value: "start",
        targetStyles: {
          carouselChildrenAlign: "left",
        },
      },
      {
        label: "pageBuilder.blocks.carousel.shortcuts.childrenPosition.center",
        value: "center",
        targetStyles: {
          carouselChildrenAlign: "center",
        },
      },
      {
        label: "pageBuilder.blocks.carousel.shortcuts.childrenPosition.end",
        value: "end",
        targetStyles: {
          carouselChildrenAlign: "right",
        },
      },
      {
        label: "pageBuilder.blocks.carousel.shortcuts.childrenPosition.stretch",
        value: "stretch",
        targetStyles: {
          carouselChildrenAlign: "justify",
        },
      },
    ],
  },
  fontFamilyShortcut as Shortcut<CarouselStylesSchema>,
  colorShortcut,
];
