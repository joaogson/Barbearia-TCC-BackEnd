import { IsDateString, IsNumber, IsOptional, IsString, Matches } from "class-validator";
import { Barber } from "generated/prisma/client";

export class CreateInactivePeriodDto {
  @IsDateString()
  date: string; // A data do bloqueio, ex: "2025-10-29"

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "O horário de início deve estar no formato HH:MM",
  })
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "O horário de término deve estar no formato HH:MM",
  })
  endTime: string;
}
