import { Controller, Get, Post, Body, Patch, Request, Param, Delete, UseGuards, ParseIntPipe } from "@nestjs/common";
import { CostumerService } from "./costumer-service.service";
import { CreateCostumerServiceDto } from "./dto/create-costumer-service.dto";
import { UpdateCostumerServiceDto } from "./dto/update-costumer-service.dto";
import { RolesGuard } from "src/auth/guards/role.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "generated/prisma/client";

@Controller("costumer-service")
export class CostumerServiceController {
  constructor(private readonly costumerServiceService: CostumerService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT, Role.ADMIN)
  @Post()
  create(@Body() createCostumerServiceDto: CreateCostumerServiceDto) {
    return this.costumerServiceService.create(createCostumerServiceDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER, Role.CLIENT, Role.ADMIN)
  @Get()
  findAll() {
    return this.costumerServiceService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER, Role.CLIENT, Role.ADMIN)
  @Get("find")
  findOne(@Request() req) {
    const id = req.user.userId;
    return this.costumerServiceService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT, Role.BARBER, Role.ADMIN)
  @Get("me")
  findById(@Request() req) {
    const id = req.user.userId;
    console.log("Id é: ", id);
    return this.costumerServiceService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT, Role.ADMIN)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCostumerServiceDto: UpdateCostumerServiceDto) {
    return this.costumerServiceService.update(+id, updateCostumerServiceDto);
  }

  @Patch(":id/cancel")
  cancelCostumerService(@Param("id", ParseIntPipe) id: string) {
    return this.costumerServiceService.cancelCostumerService(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER, Role.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.costumerServiceService.remove(+id);
  }
}
