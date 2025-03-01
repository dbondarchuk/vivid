import { Heading, HeadingProps } from "@usewaypoint/block-heading";
import { useRef } from "react";
import sanitizeHtml from "sanitize-html";
import { useCurrentBlockId } from "../../editor/block";
import { setDocument, useDocument, useEditorArgs } from "../../editor/context";
import React from "react";
import { ArgumentsAutocomplete } from "@vivid/ui";

export function HeadingEditor({ props, style }: HeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const elem = Heading({ props, style });
  const document = useDocument();
  const args = useEditorArgs();
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

  const handleKeyPress = () => (e: KeyboardEvent) => {
    const { key } = e;
    if (key === "Enter") {
      e.preventDefault();
      ref?.current?.blur();
    }
  };

  return (
    <ArgumentsAutocomplete
      args={args}
      asInput
      className="w-full border-0 focus-visible:ring-0 rounded-none h-auto p-0 border-none leading-normal md:leading-normal"
      style={styles}
      value={props?.text ?? "Heading"}
      onChange={onChange}
      onKeyDown={handleKeyPress}
    />
  );
}
