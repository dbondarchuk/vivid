import { Fragment, ReactNode } from "react";
import reactStringReplace from "react-string-replace";

export function formatJsx(template: string, ...args: any | ReactNode[]) {
  return reactStringReplace(template, /{(\d+)}/g, function (match, index) {
    return (
      <Fragment key={index}>
        {typeof args[match] != "undefined" ? args[match] : match}
      </Fragment>
    );
  });
}
