"use client";

import { ConfigurationProps } from "@vivid/builder";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { BookingProps } from "./schema";
import { bookingShortcuts } from "./shortcuts";
import { styles } from "./styles";

export const BookingConfiguration = ({
  data,
  setData,
}: ConfigurationProps<BookingProps>) => {
  const updateData = (d: unknown) => setData(d as BookingProps);

  return (
    <StylesConfigurationPanel
      styles={data.style ?? {}}
      onStylesChange={(style) => updateData({ ...data, style })}
      availableStyles={styles}
      shortcuts={bookingShortcuts}
    />
  );
};
