import { PartialType } from "@nestjs/mapped-types";
import { CreateBarberDto } from "./create-barber.dto";
import { IsNotEmpty, IsOptional, IsString, IsStrongPassword, Max, MaxLength } from "class-validator";
import { isStringObject } from "util/types";

export class UpdateBarberDto extends PartialType(CreateBarberDto) {
  @IsString()
  @MaxLength(64)
  @IsOptional()
  readonly name?: string;

  @IsString()
  @MaxLength(64)
  @IsOptional()
  readonly email?: string;

  @IsString()
  @MaxLength(64)
  @IsOptional()
  readonly phone?: number;

  @IsString()
  @MaxLength(64)
  @IsOptional()
  readonly username?: string;

  @IsString()
  @IsOptional()
  @IsStrongPassword({
    minLength: 8,
  })
  readonly password?: string;
}
