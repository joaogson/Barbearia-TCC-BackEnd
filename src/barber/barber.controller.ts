import { Controller, Patch, Body, UseGuards, Request, Get, ValidationPipe, Post, Param, Delete, Query, ParseIntPipe } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/role.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "generated/prisma/client";
import { BarberService } from "./barber.service";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { updateSettingsDto } from "./dto/update-barber.dto";
import { CreateInactivePeriodDto } from "./dto/create-inactive-period.dto";

@ApiTags("barber")
@ApiBearerAuth()
@Controller("barber")
export class BarberController {
  constructor(private barberService: BarberService) {}

  //BARBER
  //BARBER
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT, Role.BARBER)
  @Get(":id")
  getProfile(@Param("id") id: string) {
    console.log("ID recebido no controller:", id);
    return this.barberService.getBarber(+id);
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER)
  getMyProfile(@Request() req) {
    const userId = req.user.userId;
    return this.barberService.getBarber(userId);
  }

  //SETTINGS
  //SETTINGS
  @Get("me/settings")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER)
  getSettings(@Request() req) {
    const user = req.user.userId;
    return this.barberService.getSettings(user);
  }

  @Patch("me/settings")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER)
  updateSettings(@Request() req, @Body() updateSettingsDto: updateSettingsDto) {
    console.log(updateSettingsDto);
    const user = req.user.userId;
    return this.barberService.updateSettings(user, updateSettingsDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER)
  createBarber(@Request() req) {
    return this.barberService.create(req);
  }

  //INACTIVE PERIODS
  //INACTIVE PERIODS
  @Post("me/inactive-periods")
  @UseGuards(JwtAuthGuard)
  createInactivePeriod(@Request() req, @Body() createInactivePeriodDto: CreateInactivePeriodDto) {
    const userId = req.user.id;
    return this.barberService.createInactivePeriods(userId, createInactivePeriodDto);
  }

  // ROTA PARA LISTAR OS PERÍODOS DE UM DIA (útil para o front-end)
  @Get("me/inactive-periods")
  @UseGuards(JwtAuthGuard)
  getInactivePeriods(@Request() req, @Query("date") date: string) {
    const userId = req.user.id;
    return this.barberService.getInactivePeriodsByDate(userId, date);
  }

  // ROTA PARA DELETAR UM PERÍODO INATIVO
  @Delete("me/inactive-periods/:id")
  @UseGuards(JwtAuthGuard)
  deleteInactivePeriod(@Request() req, @Param("id", ParseIntPipe) id: number) {
    const userId = req.user.id;
    // O serviço deve verificar se o barbeiro logado é o "dono" deste período
    return this.barberService.deleteInactivePeriods(userId, id);
  }
}
