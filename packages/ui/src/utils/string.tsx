import { Fragment, ReactNode } from "react";
import reactStringReplace from "react-string-replace";
import { resolve } from "@vivid/utils";

export function formatJsx(
  template: string,
  args: Record<string, any | ReactNode>
) {
  return reactStringReplace(
    template,
    /{{\s*([0-9A-Za-z_-]+)\s*}}/g,
    function (match, index) {
      const resolved = resolve(args, match);
      return (
        <Fragment key={index}>
          {typeof resolved != "undefined" ? resolved : match}
        </Fragment>
      );
    }
  );
}
