import Mustache from "mustache";
import type { ReactNode } from "react";
import reactStringReplace from "react-string-replace";

export function format(template: string, ...args: any[]) {
  return template?.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != "undefined" ? args[number] : match;
  });
}

export function template(template: string, args?: Record<string, any>) {
  return Mustache.render(template, args);
}

export function formatJsx(template: string, ...args: any | ReactNode[]) {
  return reactStringReplace(template, /{(\d+)}/g, function (match) {
    return typeof args[match] != "undefined" ? args[match] : match;
  });
}
