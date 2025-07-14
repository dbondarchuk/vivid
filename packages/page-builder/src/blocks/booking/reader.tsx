import { v4 } from "uuid";
import { BlockStyle } from "../../helpers/styling";
import { Booking } from "./components/booking";
import { BookingReaderProps } from "./schema";
import { styles } from "./styles";
import { generateClassName } from "../../helpers/class-name-generator";

export const BookingReader = ({
  props,
  style,
  ...rest
}: BookingReaderProps) => {
  const className = generateClassName();

  return (
    <>
      <BlockStyle name={className} styleDefinitions={styles} styles={style} />
      <Booking className={className} />
    </>
  );
};
