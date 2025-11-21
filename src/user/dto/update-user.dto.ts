import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword, Max, MaxLength } from "class-validator";
import { Transform } from "class-transformer";

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
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return value.replace(/\D/g, "");
    }
  })
  readonly phone?: string;
}
