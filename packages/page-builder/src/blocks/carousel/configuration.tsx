"use client";

import { ConfigurationProps, SliderInput } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { Checkbox, Label } from "@vivid/ui";
import { Repeat1 } from "lucide-react";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { CarouselProps, styles } from "./schema";
import { carouselShortcuts } from "./shortcuts";

export const CarouselConfiguration = ({
  data,
  setData,
  base,
  onBaseChange,
}: ConfigurationProps<CarouselProps>) => {
  const updateData = (d: unknown) => setData(d as CarouselProps);
  const t = useI18n("builder");

  return (
    <StylesConfigurationPanel
      styles={data.style ?? {}}
      onStylesChange={(style) => updateData({ ...data, style })}
      availableStyles={styles}
      shortcuts={carouselShortcuts}
      base={base}
      onBaseChange={onBaseChange}
    >
      <div className="flex items-center gap-2 flex-1">
        <Checkbox
          id="loop"
          checked={!!data.props.loop}
          onCheckedChange={(loop) =>
            updateData({ ...data, props: { ...data.props, loop } })
          }
        />
        <Label htmlFor="loop">{t("pageBuilder.blocks.carousel.loop")}</Label>
      </div>
      <div className="flex items-center gap-2 flex-1">
        <Checkbox
          id="autoPlay"
          checked={!!data.props.autoPlay}
          onCheckedChange={(checked) =>
            updateData({
              ...data,
              props: {
                ...data.props,
                autoPlay: checked ? 5 : null,
              },
            })
          }
        />
        <Label htmlFor="autoPlay">
          {t("pageBuilder.blocks.carousel.autoPlay")}
        </Label>
      </div>
      {data.props.autoPlay && (
        <SliderInput
          defaultValue={data.props.autoPlay}
          onChange={(value) =>
            updateData({
              ...data,
              props: { ...data.props, autoPlay: value },
            })
          }
          label={t("pageBuilder.blocks.carousel.autoPlaySpeed")}
          iconLabel={<Repeat1 />}
          units={t("pageBuilder.blocks.carousel.autoPlaySeconds")}
          min={1}
          max={30}
          step={1}
        />
      )}
    </StylesConfigurationPanel>
  );
};
