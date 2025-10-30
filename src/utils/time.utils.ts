// src/utils/time.utils.ts

/**
 * Converte uma string de tempo no formato "HH:MM" para o total de minutos.
 */
export function timeToMinutes(time: string): number {
  if (!time || !time.includes(":")) {
    return NaN; // Retorna 'Not a Number' se o formato for inválido
  }
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Converte um total de minutos para uma string de tempo no formato "HH:MM".
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  // Garante que ambos tenham dois dígitos (ex: 9 vira "09")
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(mins).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}

/**
 * Extrai e formata o horário (Date) para "HH:MM".
 */
export function formatTimeFromDate(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "00:00"; // Retorna um valor padrão se a data for inválida
  }
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}
