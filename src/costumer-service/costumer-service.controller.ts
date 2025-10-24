import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
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
  @Roles(Role.BARBER)
  @Post()
  create(@Body() createCostumerServiceDto: CreateCostumerServiceDto) {
    return this.costumerServiceService.create(createCostumerServiceDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER, Role.CLIENT)
  @Get()
  findAll() {
    return this.costumerServiceService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.costumerServiceService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCostumerServiceDto: UpdateCostumerServiceDto) {
    return this.costumerServiceService.update(+id, updateCostumerServiceDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.costumerServiceService.remove(+id);
  }
}
