import { IsInt, IsOptional, IsString, Matches, Min } from "class-validator";

export class UpdateBarberDto {}

export class updateSettingsDto {
  @IsOptional()
  @IsString()
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
  @Min(0)
  breakBetweenCostumerService?: number;
}
