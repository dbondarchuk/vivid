import { ReaderBlock, ReaderProps } from "@vivid/builder";
import { COLORS, getColorStyle } from "../../style/helpers/colors";
import { getFontFamily } from "../../style-inputs/helpers/styles";
import { PageLayoutReaderProps } from "./schema";
import { cn } from "@vivid/ui";

export const PageLayoutReader = ({
  args,
  document,
  ...props
}: ReaderProps<PageLayoutReaderProps>) => {
  const children = props.children ?? [];
  return (
    <>
      <div
        style={{
          backgroundColor: getColorStyle(
            props.backgroundColor ?? COLORS.background.value
          ),
          color: getColorStyle(props.textColor ?? COLORS.foreground.value),
          fontFamily: getFontFamily(props.fontFamily),
          fontSize: "16px",
          fontWeight: "400",
          letterSpacing: "0.15008px",
          lineHeight: "1.5",
          margin: "0",
          width: "100%",
          minHeight: "100%",
        }}
      >
        <div className={cn("w-full", !props.fullWidth && "container mx-auto")}>
          {children.map((child) => (
            <ReaderBlock
              blocks={props.blocks}
              key={child.id}
              block={child}
              args={args}
              document={document}
              isEditor={props.isEditor}
            />
          ))}
        </div>
      </div>
    </>
  );
};
