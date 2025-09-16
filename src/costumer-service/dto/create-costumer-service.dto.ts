import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class CreateCostumerServiceDto {
  @IsDateString()
  @IsNotEmpty()
  ServiceTime: Date;

  @IsBoolean()
  isPaid: boolean;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  clientId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  barberId: number;
}
