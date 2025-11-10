/* eslint-disable @typescript-eslint/no-unsafe-call */

import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, Max, IsNumber } from "class-validator";

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(64)
  email: string;

  @IsNumber()
  @IsNotEmpty()
  @Max(11)
  phone: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
  })
  password: string;

  
}
