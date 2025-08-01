"use client";

import { ConfigurationProps, SelectInput } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { deepMemo } from "@vivid/ui";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { overlayType, PopupProps, showPopupType } from "./schema";
import { popupShortcuts } from "./shortcuts";
import { styles } from "./styles";
import { useCallback, useMemo } from "react";

export const PopupConfiguration = deepMemo(
  ({ data, setData, base, onBaseChange }: ConfigurationProps<PopupProps>) => {
    const updateStyle = useCallback(
      (s: unknown) => setData({ ...data, style: s as PopupProps["style"] }),
      [setData, data]
    );

    const updateProps = useCallback(
      (p: unknown) => setData({ ...data, props: p as PopupProps["props"] }),
      [setData, data]
    );

    const t = useI18n("builder");

    const showOptions = useMemo(() => {
      return showPopupType.map((show) => ({
        value: show,
        label: t(`pageBuilder.blocks.popup.show.${show}`),
      }));
    }, [t]);

    const overlayOptions = useMemo(() => {
      return overlayType.map((overlay) => ({
        value: overlay,
        label: t(`pageBuilder.blocks.popup.overlay.${overlay}`),
      }));
    }, [t]);

    return (
      <StylesConfigurationPanel
        styles={data.style ?? {}}
        onStylesChange={updateStyle}
        availableStyles={styles}
        shortcuts={popupShortcuts}
        base={base}
        onBaseChange={onBaseChange}
      >
        <SelectInput
          label={t("pageBuilder.blocks.popup.show.label")}
          defaultValue={data.props.show}
          onChange={(show) => updateProps({ ...data.props, show })}
          options={showOptions}
        />
        <SelectInput
          label={t("pageBuilder.blocks.popup.overlay.label")}
          defaultValue={data.props.overlay}
          onChange={(overlay) => updateProps({ ...data.props, overlay })}
          options={overlayOptions}
        />
      </StylesConfigurationPanel>
    );
  }
);
