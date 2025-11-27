import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
  @IsNotEmpty({ message: "O e-mail não pode ser vazio." })
  @IsEmail({}, { message: "Forneça um endereço de e-mail válido." })
  email: string;
}
