import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class CreatePlanDto {
  @IsNumber()
  value: number;

  @IsNumber()
  haircutNumber: number;
}
