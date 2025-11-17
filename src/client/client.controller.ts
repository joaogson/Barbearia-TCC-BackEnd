import { Controller, Patch, Body, UseGuards, Request, Get, ValidationPipe, Param, ParseIntPipe } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/role.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "generated/prisma/client";
import { ClientService } from "./client.service";
import { UpdateClientDto, UpdateClientPlanDto } from "./dto/update-client.dto"; // Crie este DTO
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("client")
@ApiBearerAuth()
@Controller("client")
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Patch("profile")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT, Role.ADMIN)
  updateMyProfile(@Request() req, @Body(ValidationPipe) updateClientDto: UpdateClientDto) {
    const userId = req.user.userId;
    return this.clientService.updateClient(userId, updateClientDto);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT, Role.ADMIN)
  getMyProfile(@Request() req) {
    const userId = req.user.userId;
    return this.clientService.getClient(userId);
  }

  @Get("my-plan")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT, Role.ADMIN)
  getMyPlan(@Request() req) {
    const userId = req.user.userId;
    const plan = this.clientService.getMyPlan(userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER, Role.ADMIN)
  getClients(@Request() req) {
    return this.getClients(req);
  }

  @Get("management")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER, Role.ADMIN)
  findAllForManagement() {
    return this.clientService.getClientsForPlan();
  }

  @Patch(":clientId/plan")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER, Role.ADMIN)
  updatePlan(@Param("clientId", ParseIntPipe) clientId: number, @Body() body: UpdateClientPlanDto) {
    return this.clientService.updateClientPlan(clientId, body.planId);
  }
}
