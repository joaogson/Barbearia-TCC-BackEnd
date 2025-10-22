import { Controller, Get, Patch, Request, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/role.guard";
import { Role } from "generated/prisma";
import { Roles } from "src/auth/decorators/roles.decorator";

@ApiTags("user")
@ApiBearerAuth()
@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Request() req) {
    // req.user foi anexado pelo JwtAuthGuard e contém o payload do token
    // { "sub": "user-id-...", "role": "BARBER" }
    const userId = req.user.userId;

    // Podemos retornar o usuário e seu perfil detalhado
    return this.userService.findById(userId);
  }

  @Patch("upgradeToBarber")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER)
  async upgradeToBarber(@Request() req) {
    const userId = req.user.userId;
    const data = {
      role: Role.BARBER,
    };

    return this.userService.update(userId, data);
  }
  //@Getall
}
