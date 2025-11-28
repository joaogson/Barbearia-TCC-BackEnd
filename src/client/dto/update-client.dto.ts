import { PartialType } from "@nestjs/mapped-types";
import { CreateClientDto } from "./create-client.dto";
import { IsInt, IsOptional, IsString, Max, ValidateIf } from "class-validator";

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly email?: string;

  @IsOptional()
  @Max(11)
  readonly phone?: number;

  @IsString()
  @IsOptional()
  readonly username?: string;

  @IsString()
  @IsOptional()
  readonly password?: string;

  @IsOptional()
  @ValidateIf((o) => o.planId !== null)
  @IsString()
  planId?: number | null;
}

export class UpdateClientPlanDto {
  @IsInt()
  @IsOptional()
  planId: number | null;
}
