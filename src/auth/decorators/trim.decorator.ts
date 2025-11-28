import { Transform } from "class-transformer";

export function Trim() {
  return Transform((params) => {
    const value = params.value;
    if (typeof value === "string") {
      return value.trim();
    }
    return value;
  });
}
