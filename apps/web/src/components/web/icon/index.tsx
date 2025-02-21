import { cx } from "class-variance-authority";
import { Children, cloneElement, isValidElement, SVGProps } from "react";
import { twMerge } from "tailwind-merge";
import { CustomIcons } from "./custom-icons";
import { IconProps } from "./types";

export const Icon: React.FC<IconProps> = ({
  name,
  size = "36px",
  iconStyle = "round",
  label,
  className,
  children,
  viewBox,
  ...restProps
}) => {
  const Component = CustomIcons[name];
  // Convert number sizes to pixels. If size is a stringified integer, convert it to integer
  const computedSize =
    typeof size === "number"
      ? `${size}px`
      : /^\d+$/.test(size)
        ? `${parseInt(size)}px`
        : size;
  const iconClass = twMerge("overflow-hidden", className, viewBox);
  const testId = `icon-${name}`;
  const accessibilityLabel = label || name;

  // If children (custom icon) are passed, render them
  if (children && isValidElement<SVGProps<SVGSVGElement>>(children)) {
    return cloneElement(children, {
      className: cx(children.props.className, iconClass),
      role: "img",
      style: {
        ...children.props.style,
        width: computedSize,
        height: computedSize,
      },
      children: Children.map(children.props.children, (child, index) =>
        cloneElement(child as React.ReactElement, { key: index })
      )?.concat(
        <title key={`title for ${accessibilityLabel}`}>
          {accessibilityLabel}
        </title>
      ),
    });
  }

  // Render custom SVG icon
  return (
    <Component
      data-qa={testId}
      role="img"
      className={iconClass}
      viewBox={viewBox}
      style={{
        width: computedSize,
        height: computedSize,
        minWidth: computedSize,
        minHeight: computedSize,
      }}
      {...restProps}
    >
      <title>{accessibilityLabel}</title>
    </Component>
  );
};

Icon.displayName = "Icon";
