import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, Max, IsEnum } from "class-validator";


export class CreateUserDto {
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
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
