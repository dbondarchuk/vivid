import { cn } from "@vivid/ui";
import { generateClassName } from "../../helpers/class-name-generator";
import { ReplaceOriginalColors } from "../../helpers/replace-original-colors";
import { BlockStyle } from "../../helpers/styling";
import { Booking } from "./components/booking";
import { BookingReaderProps } from "./schema";
import { styles } from "./styles";

export const BookingReader = ({
  props,
  style,
  args,
  isEditor,
  ...rest
}: BookingReaderProps) => {
  const className = generateClassName();
  const base = rest.block.base;

  return (
    <>
      <BlockStyle name={className} styleDefinitions={styles} styles={style} />
      {isEditor && <ReplaceOriginalColors />}
      <Booking
        className={cn(className, base?.className)}
        successPage={props.confirmationPage}
        id={base?.id}
      />
    </>
  );
};
