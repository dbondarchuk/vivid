import { v4 } from "uuid";
export function generateId() {
  return `block-${v4()}`;
}
