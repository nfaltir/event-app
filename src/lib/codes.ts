import { randomBytes } from "crypto";

export function generateCode(length = 8) {
  return randomBytes(length)
    .toString("hex")
    .slice(0, length)
    .toUpperCase();
}