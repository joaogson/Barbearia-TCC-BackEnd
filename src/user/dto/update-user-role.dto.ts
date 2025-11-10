import { IsEnum, IsNotEmpty } from "class-validator";
import { Role } from "generated/prisma/client"; // Importa o Enum do Prisma

export class UpdateUserRoleDto {
  @IsEnum(Role, { message: "O role deve ser um dos valores válidos: CLIENT, BARBER" })
  @IsNotEmpty()
  role: Role;
}
