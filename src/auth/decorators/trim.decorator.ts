import { Transform } from "class-transformer";

export function Trim() {
  return Transform((params) => {
    const value = params.value;
    // Se o valor for uma string, retorne ela sem espaços no início/fim.
    // Caso contrário, retorne o valor original (para não quebrar com números, booleans, null, undefined)
    if (typeof value === "string") {
      return value.trim();
    }
    return value;
  });
}
