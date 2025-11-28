import { Body, Controller, ForbiddenException, Get, Param, ParseIntPipe, Patch, Req, Request, UseGuards, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/role.guard";
import { Role } from "generated/prisma/client";
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

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async getUser(@Param("id", ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER, Role.CLIENT)
  @Patch(":id")
  async update(@Param("id", ParseIntPipe) userId: number, @Body() dto: UpdateUserDto, @Request() req) {
    const loggedInUserId = req.user.userId;
    if (loggedInUserId !== userId) {
      throw new ForbiddenException("Você não tem permissão para executar esta ação.");
    }

    return this.userService.update(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("update-password")
  async updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
    const userId = req.user["id"];
    return this.userService.updatePassword(userId, updatePasswordDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER, Role.CLIENT)
  @Patch(":id/role")
  async updateUserRole(@Param("id", ParseIntPipe) userId: number, @Body() updateUserRoleDto: UpdateUserRoleDto) {
    return this.userService.updateUserRole(userId, updateUserRoleDto.role);
  }
}
