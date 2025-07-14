"use client";

import {
  ConfigurationProps,
  SelectInput,
  SliderInput,
  TextDoubleNumberInput,
} from "@vivid/builder";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { CarouselProps, itemPositions, styles } from "./schema";
import { carouselShortcuts } from "./shortcuts";
import { useI18n } from "@vivid/i18n";
import { GalleryHorizontal, Repeat1 } from "lucide-react";
import { Checkbox, Label } from "@vivid/ui";

export const CarouselConfiguration = ({
  data,
  setData,
}: ConfigurationProps<CarouselProps>) => {
  const updateData = (d: unknown) => setData(d as CarouselProps);
  const t = useI18n("builder");

  return (
    <StylesConfigurationPanel
      styles={data.style ?? {}}
      onStylesChange={(style) => updateData({ ...data, style })}
      availableStyles={styles}
      shortcuts={carouselShortcuts}
    >
      <SelectInput
        defaultValue={data.props.itemPosition}
        onChange={(value) =>
          updateData({ ...data, props: { ...data.props, itemPosition: value } })
        }
        label={t("pageBuilder.blocks.carousel.itemPosition.label")}
        size="sm"
        options={itemPositions.map((pos) => ({
          value: pos,
          label: t(`pageBuilder.blocks.carousel.itemPosition.${pos}`),
        }))}
      />
      <div className="flex items-center gap-2 flex-1">
        <Checkbox
          id="fullWidth"
          checked={!!data.props.loop}
          onCheckedChange={(loop) =>
            updateData({ ...data, props: { ...data.props, loop } })
          }
        />
        <Label htmlFor="fullWidth">
          {t("pageBuilder.blocks.carousel.loop")}
        </Label>
      </div>
      <SliderInput
        label={t("pageBuilder.blocks.carousel.autoPlay")}
        units={t("pageBuilder.blocks.carousel.autoPlaySeconds")}
        iconLabel={<Repeat1 />}
        min={1}
        max={30}
        step={1}
        defaultValue={data.props.autoPlay || null}
        nullable
        onChange={(autoPlay) =>
          updateData({ ...data, props: { ...data.props, autoPlay } })
        }
      />
      <SliderInput
        label={t("pageBuilder.blocks.carousel.items")}
        units=""
        iconLabel={<GalleryHorizontal />}
        min={1}
        max={10}
        step={1}
        defaultValue={data.props.items}
        onChange={(value) =>
          updateData({ ...data, props: { ...data.props, itemsSm: value } })
        }
      />
      <SliderInput
        label={t("pageBuilder.blocks.carousel.itemsSm")}
        units=""
        iconLabel={<GalleryHorizontal />}
        min={1}
        max={10}
        step={1}
        nullable
        defaultValue={data.props.itemsSm ?? null}
        onChange={(value) =>
          updateData({ ...data, props: { ...data.props, itemsSm: value } })
        }
      />
      <SliderInput
        label={t("pageBuilder.blocks.carousel.itemsMd")}
        units=""
        iconLabel={<GalleryHorizontal />}
        min={1}
        max={10}
        step={1}
        nullable
        defaultValue={data.props.itemsMd ?? null}
        onChange={(value) =>
          updateData({ ...data, props: { ...data.props, itemsMd: value } })
        }
      />
      <SliderInput
        label={t("pageBuilder.blocks.carousel.itemsLg")}
        units=""
        iconLabel={<GalleryHorizontal />}
        min={1}
        max={10}
        step={1}
        nullable
        defaultValue={data.props.itemsLg ?? null}
        onChange={(value) =>
          updateData({ ...data, props: { ...data.props, itemsLg: value } })
        }
      />
      <SliderInput
        label={t("pageBuilder.blocks.carousel.itemsXl")}
        units=""
        iconLabel={<GalleryHorizontal />}
        min={1}
        max={10}
        step={1}
        nullable
        defaultValue={data.props.itemsXl ?? null}
        onChange={(value) =>
          updateData({ ...data, props: { ...data.props, itemsXl: value } })
        }
      />
      <SliderInput
        label={t("pageBuilder.blocks.carousel.items2Xl")}
        units=""
        iconLabel={<GalleryHorizontal />}
        min={1}
        max={10}
        step={1}
        nullable
        defaultValue={data.props.items2Xl ?? null}
        onChange={(value) =>
          updateData({ ...data, props: { ...data.props, items2Xl: value } })
        }
      />
    </StylesConfigurationPanel>
  );
};
