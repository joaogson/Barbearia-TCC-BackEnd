import { PartialType } from "@nestjs/mapped-types";
import { RegisterAuthDto } from "./register-auth.dto";
import { IsString, IsStrongPassword, IsNotEmpty, MinLength } from "class-validator";

export class LoginAuthDto extends PartialType(RegisterAuthDto) {
  @IsString()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
