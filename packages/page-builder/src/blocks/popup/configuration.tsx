"use client";

import { ConfigurationProps, SelectInput } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { PopupProps, showPopupType } from "./schema";
import { popupShortcuts } from "./shortcuts";
import { styles } from "./styles";

export const PopupConfiguration = ({
  data,
  setData,
  base,
  onBaseChange,
}: ConfigurationProps<PopupProps>) => {
  const updateData = (d: unknown) => setData(d as PopupProps);

  const t = useI18n("builder");

  return (
    <StylesConfigurationPanel
      styles={data.style ?? {}}
      onStylesChange={(style) => updateData({ ...data, style })}
      availableStyles={styles}
      shortcuts={popupShortcuts}
      base={base}
      onBaseChange={onBaseChange}
    >
      <SelectInput
        label={t("pageBuilder.blocks.popup.show.label")}
        defaultValue={data.props.show}
        onChange={(show) =>
          updateData({ ...data, props: { ...data.props, show } })
        }
        options={showPopupType.map((show) => ({
          value: show,
          label: t(`pageBuilder.blocks.popup.show.${show}`),
        }))}
      />
    </StylesConfigurationPanel>
  );
};
