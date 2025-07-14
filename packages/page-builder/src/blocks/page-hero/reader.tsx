import { ReaderBlock } from "@vivid/builder";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { PageHeroReaderProps } from "./schema";
import { styles } from "./styles";

export const PageHeroReader = ({
  props,
  style,
  ...rest
}: PageHeroReaderProps) => {
  const title = props?.title?.children || [];
  const subtitle = props?.subtitle?.children || [];
  const buttons = props?.buttons?.children || [];
  const className = generateClassName();

  return (
    <>
      <BlockStyle name={className} styleDefinitions={styles} styles={style} />
      <section className={className}>
        {title.map((child) => (
          <ReaderBlock key={child.id} block={child} {...rest} />
        ))}
        {subtitle.map((child) => (
          <ReaderBlock key={child.id} block={child} {...rest} />
        ))}
        {buttons.map((child) => (
          <ReaderBlock key={child.id} block={child} {...rest} />
        ))}
      </section>
    </>
  );
};
