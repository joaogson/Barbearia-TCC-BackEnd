import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, Max } from "class-validator";

export class CreateBarberDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(64)
  email: string;

  @IsString()
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
  })
  password: string;
}
