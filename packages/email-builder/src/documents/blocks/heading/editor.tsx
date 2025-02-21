import { Heading, HeadingProps } from "@usewaypoint/block-heading";
import { useRef } from "react";
import ContentEditable from "react-contenteditable";
import sanitizeHtml from "sanitize-html";
import { useCurrentBlockId } from "../../editor/block";
import { setDocument, useDocument } from "../../editor/context";

export function HeadingEditor({ props, style }: HeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const elem = Heading({ props, style });
  const document = useDocument();
  const currentBlockId = useCurrentBlockId();

  const styles = elem.props.style;

  const sanitizeConf = {
    allowedTags: [],
    allowedAttributes: {},
  };

  const onChange = (value: string) => {
    setDocument({
      [currentBlockId]: {
        type: "Heading",
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

  const handleKeyPress = (e: KeyboardEvent) => {
    const { key } = e;
    if (key === "Enter") {
      e.preventDefault();
      ref?.current?.blur();
    }
  };

  return (
    <ContentEditable
      innerRef={(node: HTMLElement) => {
        ref.current = node;
      }}
      html={props?.text || "Heading"}
      onChange={(e) => onChange(e.target.value)}
      style={styles}
      tagName={props?.level || "h2"}
      onKeyDown={handleKeyPress}
    />
  );
}
