import { Popup } from "./popup";
import { PopupReaderProps } from "./schema";

import { ReaderBlock } from "@vivid/builder";
import {
  cn,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@vivid/ui";
import { generateClassName } from "../../helpers/class-name-generator";
import { ReplaceOriginalColors } from "../../helpers/replace-original-colors";
import { BlockStyle } from "../../helpers/styling";
import { styles } from "./styles";

export const PopupReader = ({
  props,
  style,
  block,
  isEditor,
  ...rest
}: PopupReaderProps) => {
  const title = props?.title?.children || [];
  const subtitle = props?.subtitle?.children || [];
  const buttons = props?.buttons?.children || [];
  const content = props?.content?.children || [];
  const overlay = props?.overlay;
  const className = generateClassName();
  const base = block.base;

  return (
    <>
      <BlockStyle name={className} styleDefinitions={styles} styles={style} />
      <Popup
        blockId={block.id}
        show={props.show}
        isEditor={isEditor}
        id={base?.id}
        className={cn(className, base?.className)}
        overlay={overlay}
      >
        <ReplaceOriginalColors />
        <DialogHeader>
          <DialogTitle>
            {title.map((child) => (
              <ReaderBlock key={child.id} {...rest} block={child} />
            ))}
          </DialogTitle>
          <DialogDescription>
            {subtitle.map((child) => (
              <ReaderBlock key={child.id} {...rest} block={child} />
            ))}
          </DialogDescription>
        </DialogHeader>
        {content.map((child) => (
          <ReaderBlock key={child.id} block={child} {...rest} />
        ))}
        <DialogFooter>
          {buttons.map((child) => (
            <ReaderBlock key={child.id} block={child} {...rest} />
          ))}
        </DialogFooter>
      </Popup>
    </>
  );
};
