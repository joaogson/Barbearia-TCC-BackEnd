import { PartialType } from "@nestjs/mapped-types";
import { CreateClientDto } from "./create-client.dto";
import { IsOptional, IsString, Max, ValidateIf } from "class-validator";
import { Plan } from "src/plan/entities/plan.entity";

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
  @ValidateIf((o) => o.planId !== null) // Só valida se o valor não for 'null'
  @IsString() // ou @IsString(), dependendo do seu tipo de ID
  planId?: number | null;
}
