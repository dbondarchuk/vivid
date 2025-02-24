import { Button, ButtonProps } from "@usewaypoint/block-button";
import { useRef } from "react";
import ContentEditable from "react-contenteditable";
import sanitizeHtml from "sanitize-html";
import { useCurrentBlockId } from "../../editor/block";
import { setDocument, useDocument } from "../../editor/context";

export function ButtonEditor({ props, style }: ButtonProps) {
  const ref = useRef<HTMLElement>(null);

  const wrapper = Button({ props, style });
  const link = wrapper.props.children;

  const wrapperStyles = wrapper.props.style;
  const linkStyles = link.props.style;

  const document = useDocument();
  const currentBlockId = useCurrentBlockId();

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    if (key === "Enter") {
      e.preventDefault();
      ref?.current?.blur();
    }
  };

  return (
    <div style={wrapperStyles}>
      <input
        className="border-0 focus:outline-none active:outline-none bg-transparent w-auto"
        style={linkStyles}
        value={props?.text ?? "Heading"}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyPress}
      />
    </div>
  );
}
