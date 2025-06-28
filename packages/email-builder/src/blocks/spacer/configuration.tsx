"use client";

import { ConfigurationProps, SliderInput } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { ArrowUpDown } from "lucide-react";
import { SpacerProps, SpacerPropsDefaults } from "./schema";
import { MultiStylePropertyPanel } from "../../style-inputs/multi-style-property-panel";

export const SpacerConfiguration = ({
  data,
  setData,
}: ConfigurationProps<SpacerProps>) => {
  const t = useI18n("builder");
  const updateData = (d: unknown) => setData(d as SpacerProps);

  return (
    <>
      <SliderInput
        label={t("emailBuilder.blocks.spacer.height")}
        iconLabel={<ArrowUpDown />}
        units="px"
        step={4}
        min={4}
        max={128}
        defaultValue={data.props?.height ?? SpacerPropsDefaults.props.height}
        onChange={(height) =>
          updateData({ ...data, props: { ...data.props, height } })
        }
      />
      <MultiStylePropertyPanel
        names={["backgroundColor"]}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </>
  );
};
