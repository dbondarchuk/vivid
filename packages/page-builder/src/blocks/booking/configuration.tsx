"use client";

import { ConfigurationProps, PageInput } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { BookingProps } from "./schema";
import { bookingShortcuts } from "./shortcuts";
import { styles } from "./styles";

export const BookingConfiguration = ({
  data,
  setData,
  base,
  onBaseChange,
}: ConfigurationProps<BookingProps>) => {
  const updateData = (d: unknown) => setData(d as BookingProps);
  const t = useI18n("builder");
  return (
    <StylesConfigurationPanel
      styles={data.style ?? {}}
      onStylesChange={(style) => updateData({ ...data, style })}
      availableStyles={styles}
      shortcuts={bookingShortcuts}
      base={base}
      onBaseChange={onBaseChange}
    >
      <PageInput
        label={t("pageBuilder.blocks.booking.confirmationPage")}
        defaultValue={data.props.confirmationPage ?? null}
        nullable
        onChange={(value) =>
          updateData({
            ...data,
            props: { ...data.props, confirmationPage: value },
          })
        }
      />
    </StylesConfigurationPanel>
  );
};
