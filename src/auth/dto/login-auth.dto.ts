import { PartialType } from "@nestjs/mapped-types";
import { RegisterAuthDto } from "./register-auth.dto";
import { IsString, IsStrongPassword, IsNotEmpty, MinLength } from "class-validator";
import { Trim } from "../decorators/trim.decorator";

export class LoginAuthDto extends PartialType(RegisterAuthDto) {
  @IsString()
  @Trim()
  email: string;
  @IsString()
  @IsNotEmpty()
  @Trim()
  password: string;
}
