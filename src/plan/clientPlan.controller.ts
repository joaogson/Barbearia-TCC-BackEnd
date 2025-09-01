import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { PlanService } from "./plan.service";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";

@Controller("clients/:clientId/plan")
export class ClientPlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.planService.create(createPlanDto);
  }

  @Get()
  findByClient(@Param("clientId") clientId: string) {
    return this.planService.findOne(+clientId);
  }

  @Patch(":clientId")
  updatePlanByClientId(@Param("clientId") clientId: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.planService.update(+clientId, updatePlanDto);
  }

  @Delete(":clientId")
  remove(@Param("clientId") clientId: string) {
    return this.planService.remove(+clientId);
  }
}
