import { IsInt, IsOptional, IsString, Matches, Min } from "class-validator";

export class UpdateBarberDto {}

export class updateSettingsDto {
  // O campo é opcional, pois o barbeiro pode querer mudar só o início ou só o fim.
  @IsOptional()
  @IsString()
  // Valida se o formato é "HH:MM" (ex: "09:00", "18:30")
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "O horário de início deve estar no formato HH:MM",
  })
  workStartTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "O horário de término deve estar no formato HH:MM",
  })
  workEndTime?: string;

  @IsOptional()
  @IsInt()
  @Min(0) // O valor mínimo deve ser 0
  breakBetweenCostumerService?: number;
  // @IsOptional()
  // @IsInt()
  // appointmentInterval?: number;
}
