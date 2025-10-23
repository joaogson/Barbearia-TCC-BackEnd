import { Body, Controller, ForbiddenException, Get, Param, ParseIntPipe, Patch, Req, Request, UseGuards, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/role.guard";
import { Role } from "generated/prisma";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { UpdateUserRoleDto } from "./dto/update-user-role.dto";

@ApiTags("user")
@ApiBearerAuth()
@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Request() req) {
    const userId = req.user.userId;

    return this.userService.findById(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) // Garante que o usuário está logado
  @Roles(Role.BARBER, Role.CLIENT)
  @Patch(":id")
  async update(@Param("id", ParseIntPipe) userId: number, @Body() dto: UpdateUserDto, @Request() req) {
    //Pega o ID do usuário que fez a requisição (do token JWT)
    const loggedInUserId = req.user.userId;
    //O ID do usuário logado deve ser o mesmo do parâmetro da URL
    if (loggedInUserId !== userId) {
      // Se não for, ele não tem permissão para alterar os dados de outro usuário.
      throw new ForbiddenException("Você não tem permissão para executar esta ação.");
    }

    //Se a permissão for válida, chama o serviço
    return this.userService.update(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("update-password")
  async updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    const userId = req.user["id"]; // Pega o ID do usuário logado
    return this.userService.updatePassword(userId, updatePasswordDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER)
  @Patch(":id/role") // Endpoint específico para alterar o role de um usuário
  async updateUserRole(@Param("id", ParseIntPipe) userId: number, @Body() updateUserRoleDto: UpdateUserRoleDto) {
    return this.userService.updateUserRole(userId, updateUserRoleDto.role);
  }

  //@Getall
}
