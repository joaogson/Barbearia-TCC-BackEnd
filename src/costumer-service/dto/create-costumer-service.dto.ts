import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class CreateCostumerServiceDto {
  @IsDateString()
  @IsNotEmpty()
  ServiceTime: string;

  @IsBoolean()
  isCancelled: boolean;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  clientId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  barberId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  servicesIds: number[];
}
