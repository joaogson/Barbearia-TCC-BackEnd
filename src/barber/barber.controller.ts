import { Controller, Patch, Body, UseGuards, Request, Get, ValidationPipe, Post, Req, Param } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/role.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "generated/prisma/client";
import { BarberService } from "./barber.service";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("barber")
@ApiBearerAuth()
@Controller("barber")
export class BarberController {
  constructor(private barberService: BarberService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT, Role.BARBER)
  @Get(":id")
  getProfile(@Param("id") id: string) {
    console.log("ID recebido no controller:", id);
    return this.barberService.getBarber(+id);
  }

  //Buscar o proprio perfil do barbeiro
  @Get("profile")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER)
  getMyProfile(@Request() req) {
    const userId = req.user.userId;
    return this.barberService.getProfile(userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER)
  createBarber(@Request() req) {
    return this.barberService.create(req);
  }
}
