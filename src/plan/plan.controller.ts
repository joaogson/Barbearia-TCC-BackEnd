import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { PlanService } from "./plan.service";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/role.guard";
import { Role } from "generated/prisma/client";
import { Roles } from "src/auth/decorators/roles.decorator";

@Controller("plan")
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER, Role.ADMIN)
  @Post()
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.planService.create(createPlanDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER, Role.ADMIN)
  @Get()
  findAll() {
    return this.planService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(@Param("clientId") id: string) {
    return this.planService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER, Role.ADMIN)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.planService.update(+id, updatePlanDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BARBER, Role.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.planService.remove(+id);
  }
}
