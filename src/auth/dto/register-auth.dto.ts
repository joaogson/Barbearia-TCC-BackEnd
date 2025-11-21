import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, IsOptional } from "class-validator";
import { Trim } from "../decorators/trim.decorator";

export class RegisterAuthDto {
  @IsEmail()
  @IsNotEmpty()
  @Trim()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Trim()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return value.replace(/\D/g, "");
    }
  })
  @Trim()
  phone: string;
}
