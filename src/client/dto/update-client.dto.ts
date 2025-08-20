import { PartialType } from "@nestjs/mapped-types";
import { CreateClientDto } from "./create-client.dto";
import { IsOptional, IsString, Max } from "class-validator";

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
}
