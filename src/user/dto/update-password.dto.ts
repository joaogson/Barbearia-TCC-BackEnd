import { IsNotEmpty, IsString, MinLength, Matches } from "class-validator";

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty({ message: "A senha atual é obrigatória." })
  currentPassword: string;

  @IsString()
  @MinLength(8, { message: "A nova senha deve ter no mínimo 8 caracteres." })
  newPassword: string;
}
