import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, IsOptional } from "class-validator";

export class RegisterAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}
