import { Heading, HeadingProps } from "@usewaypoint/block-heading";
import { useRef } from "react";
import sanitizeHtml from "sanitize-html";
import { useCurrentBlockId } from "../../editor/block";
import { setDocument, useDocument } from "../../editor/context";
import React from "react";

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

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
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
    },
    [setDocument]
  );

  const handleKeyPress = React.useCallback(
    () => (e: KeyboardEvent) => {
      const { key } = e;
      if (key === "Enter") {
        e.preventDefault();
        ref?.current?.blur();
      }
    },
    []
  );

  return (
    <input
      className="w-full border-0 bg-transparent"
      style={styles}
      value={props?.text ?? "Heading"}
      onChange={onChange}
      onKeyDown={handleKeyPress}
    />
  );
}
