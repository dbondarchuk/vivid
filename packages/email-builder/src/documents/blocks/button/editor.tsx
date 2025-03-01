import { Button, ButtonProps } from "@usewaypoint/block-button";
import { ArgumentsAutocomplete, cn } from "@vivid/ui";
import { useRef } from "react";
import sanitizeHtml from "sanitize-html";
import { useCurrentBlockId } from "../../editor/block";
import { setDocument, useDocument, useEditorArgs } from "../../editor/context";

export function ButtonEditor({ props, style }: ButtonProps) {
  const ref = useRef<HTMLElement>(null);

  const wrapper = Button({ props, style });
  const link = wrapper.props.children;

  const wrapperStyles = wrapper.props.style;
  const linkStyles = link.props.style;

  const document = useDocument();
  const currentBlockId = useCurrentBlockId();
  const args = useEditorArgs();

  const sanitizeConf = {
    allowedTags: [],
    allowedAttributes: {},
  };

  const onChange = (value: string) => {
    setDocument({
      [currentBlockId]: {
        type: "Button",
        data: {
          ...document[currentBlockId].data,
          props: {
            ...((document[currentBlockId].data as any) || {}).props,
            text: sanitizeHtml(value, sanitizeConf),
          },
        },
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    const { key } = e;
    if (key === "Enter") {
      e.preventDefault();
      ref?.current?.blur();
    }
  };

  return (
    <div style={wrapperStyles}>
      <ArgumentsAutocomplete
        args={args}
        asInput
        className={cn(
          "border-0 bg-transparent focus-visible:ring-0 rounded-none h-auto p-0 border-none leading-normal md:leading-normal",
          props?.fullWidth ? "w-full" : "w-auto"
        )}
        style={{ ...linkStyles, textAlign: style?.textAlign }}
        value={props?.text ?? "Button"}
        onChange={onChange}
        onKeyDown={handleKeyPress}
      />
    </div>
  );
}
