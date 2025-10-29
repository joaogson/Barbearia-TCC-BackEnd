import { PartialType } from "@nestjs/mapped-types";
import { CreateCostumerServiceDto } from "./create-costumer-service.dto";
import { IsBoolean, IsDateString, IsInt, IsOptional, IsPositive } from "class-validator";

export class UpdateCostumerServiceDto extends PartialType(CreateCostumerServiceDto) {
  @IsDateString()
  @IsOptional()
  ServiceTime?: string;

  @IsBoolean()
  @IsOptional()
  isCancelled?: boolean;

  @IsInt()
  @IsPositive()
  @IsOptional()
  clientId?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  barberId?: number;
}
