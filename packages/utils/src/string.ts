import Mustache from "mustache";
import type { ReactNode } from "react";
import reactStringReplace from "react-string-replace";

export function format(template: string, ...args: any[]) {
  return template?.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != "undefined" ? args[number] : match;
  });
}

export function template(
  template: string,
  args?: Record<string, any>,
  plainText = false
) {
  const originalEscape = Mustache.escape;

  try {
    if (plainText) Mustache.escape = (val) => val;

    return Mustache.render(template, args);
  } finally {
    Mustache.escape = originalEscape;
  }
}

export function templateSafeWithError(
  templateString: string,
  args?: Record<string, any>,
  plainText = false
) {
  try {
    return template(templateString, args, plainText);
  } catch (e) {
    return (e as Error).message;
  }
}

export function formatJsx(template: string, ...args: any | ReactNode[]) {
  return reactStringReplace(template, /{(\d+)}/g, function (match) {
    return typeof args[match] != "undefined" ? args[match] : match;
  });
}

export function escapeRegex(str: string) {
  return str.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, "\\$&");
}

export function maskify(str: string) {
  return str
    .split("")
    .map((c, index) => (index % 2 == 0 ? c : "#"))
    .join("");
}
