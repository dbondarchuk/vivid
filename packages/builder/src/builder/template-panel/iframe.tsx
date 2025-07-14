"use client";
import { IFrame } from "@vivid/ui";
import React from "react";

export const IFrameWithCss: React.FC<React.ComponentProps<typeof IFrame>> = ({
  children,
  ...props
}) => {
  const [links, setLinks] = React.useState<string[]>([]);
  const [styles, setStyles] = React.useState<string[]>([]);

  React.useEffect(() => {
    const hrefs = Array.from(
      document.querySelectorAll("link[rel=stylesheet]")
    ).map((el) => (el as any).href);
    setLinks(hrefs);

    const style = Array.from(document.querySelectorAll("style")).map(
      (el) => el.innerHTML
    );
    setStyles(style);
  }, []);

  return (
    <IFrame {...props}>
      <>
        {links.map((l) => (
          <link href={l} key={l} rel="stylesheet" />
        ))}
        {styles.map((s, index) => (
          <style
            key={index}
            dangerouslySetInnerHTML={{
              __html: s,
            }}
          />
        ))}
        <style>
          {`body {
                padding: 32px;
            }`}
        </style>
        {children}
      </>
    </IFrame>
  );
};
