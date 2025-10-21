import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-User.dto";
import { IsNotEmpty, IsOptional, IsString, IsStrongPassword, Max, MaxLength } from "class-validator";
import { isStringObject } from "util/types";

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
  readonly phone?: string;

  @IsString()
  @IsOptional()
  @IsStrongPassword({
    minLength: 8,
  })
  readonly password?: string;
}
