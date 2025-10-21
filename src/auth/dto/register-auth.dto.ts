import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, IsOptional } from "class-validator";
import { Role } from "../../../generated/prisma/client";

export class RegisterAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role; // O usuário deve escolher 'CLIENT' ou 'BARBER' no registro
}
